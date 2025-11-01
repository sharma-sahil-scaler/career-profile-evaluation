# AWS Infrastructure Documentation

## Table of Contents
- [Infrastructure Overview](#infrastructure-overview)
- [Component Deep Dive](#component-deep-dive)
- [Complete Request Flow](#complete-request-flow)
- [Monitoring & Health Checks](#monitoring--health-checks)
- [Cost Breakdown](#cost-breakdown)
- [Security Architecture](#security-architecture)
- [Scaling Behavior](#scaling-behavior)
- [Resource Relationships](#resource-relationships)
- [Key Concepts Explained](#key-concepts-explained)
- [Troubleshooting](#troubleshooting)
- [Summary](#summary)

---

## Infrastructure Overview

When you ran `eb init` and `eb create`, Elastic Beanstalk automatically created **13+ AWS resources**. Here's your actual infrastructure:

```
Internet (0.0.0.0/0)
        ↓
┌─────────────────────────────────────────────────┐
│  Application Load Balancer (ALB)                │
│  awseb--AWSEB-UXwwDwQyQeh2                      │
│  Public DNS: ...elb.amazonaws.com               │
│  Security Group: sg-0904b54e7b2350a76           │
└─────────────────────────────────────────────────┘
        ↓ (Port 80)
┌─────────────────────────────────────────────────┐
│  Target Group                                    │
│  Health Check: /career-profile-tool/api/health  │
│  Interval: 30s, Timeout: 10s                    │
└─────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────┐
│  Auto Scaling Group                              │
│  Min: 1, Max: 2, Current: 1                     │
│  Availability Zones: us-west-2a, 2b, 2c         │
└─────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────┐
│  EC2 Instance (i-0c4092e8cc57c59f9)             │
│  Type: t3.medium (2 vCPU, 4GB RAM)              │
│  Public IP: 35.90.36.181                        │
│  Private IP: 172.31.39.174                      │
│  Security Group: sg-057f6c376577d68fa           │
│  ┌────────────────────────────────────────────┐ │
│  │ EBS Volume (vol-029248839fe3ec7e2)        │ │
│  │ Type: gp3                                  │ │
│  │ Size: 30 GB                                │ │
│  │ IOPS: 3000, Throughput: 125 MB/s          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Docker Containers:                              │
│  ├─ Frontend (Nginx:80)                         │
│  ├─ Backend (FastAPI:8000)                      │
│  └─ PostgreSQL (5432)                           │
└─────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────┐
│  VPC (vpc-041cbc9a45cb2bcb8)                    │
│  CIDR: 172.31.0.0/16 (Default VPC)              │
│  Subnets across 4 Availability Zones            │
└─────────────────────────────────────────────────┘
```

---

## Component Deep Dive

### 1. VPC (Virtual Private Cloud)

**What it is**: Your isolated virtual network in AWS cloud.

**Your VPC Details**:
- **VPC ID**: `vpc-041cbc9a45cb2bcb8`
- **CIDR Block**: `172.31.0.0/16` (65,536 IP addresses)
- **Type**: Default VPC (AWS provides one per region)
- **Purpose**: Contains all your resources in an isolated network

**Analogy**: Think of it as your own private data center building where all your servers live.

**Why EB created it**: Actually, EB used your existing default VPC (not created new). All AWS accounts come with a default VPC in each region.

---

### 2. Subnets

**What they are**: Subdivisions of your VPC spread across different Availability Zones (AZs) for high availability.

**Your Subnets** (4 public subnets):

| Subnet ID | Availability Zone | CIDR Block | IP Range | Used By |
|-----------|------------------|------------|----------|---------|
| `subnet-06cb88e83463cf746` | us-west-2a | 172.31.16.0/20 | 4,096 IPs | ALB |
| `subnet-08e7745532a1e0ec2` | us-west-2b | 172.31.32.0/20 | 4,096 IPs | ALB + EC2 Instance |
| `subnet-0f45435632ad2cc87` | us-west-2c | 172.31.0.0/20 | 4,096 IPs | ALB |
| `subnet-0010e3c8a69f7760f` | us-west-2d | 172.31.48.0/20 | 4,096 IPs | ALB |

**Key Feature**: `MapPublicIpOnLaunch: true` = Resources get public IPs automatically

**Analogy**: Like different floors in your data center building, each in a separate geographic location for disaster recovery.

**Why multiple AZs**: If one data center (AZ) fails, your app continues running in another AZ.

---

### 3. Security Groups (Firewalls)

**What they are**: Virtual firewalls that control inbound/outbound traffic.

#### ALB Security Group (`sg-0904b54e7b2350a76`)

```
Name: awseb-e-xeucub6m6k-stack-AWSEBLoadBalancerSecurityGroup
Purpose: Protects the Load Balancer

INBOUND RULES:
✅ Port 80 (HTTP) from 0.0.0.0/0 (anyone on internet)
❌ All other ports: BLOCKED

OUTBOUND RULES:
✅ All traffic allowed (default)
```

**What this means**: Anyone on the internet can hit your ALB on port 80. ALB can talk to anything.

#### EC2 Instance Security Group (`sg-057f6c376577d68fa`)

```
Name: awseb-e-xeucub6m6k-stack-AWSEBSecurityGroup
Purpose: Protects the EC2 instance

INBOUND RULES:
✅ Port 80 (HTTP) from sg-0904b54e7b2350a76 (ALB only)
✅ Port 22 (SSH) from 0.0.0.0/0 (for eb ssh access)
❌ All other ports: BLOCKED

OUTBOUND RULES:
✅ All traffic allowed (default)
```

**What this means**: Only the ALB can send HTTP traffic to your instance. You can SSH from anywhere (for debugging). Your containers (Postgres, Backend, Frontend) communicate internally via Docker network.

**Security Design**:
```
Internet → ALB (port 80) → EC2 Instance (port 80) → Docker containers
         ✅ Allowed      ✅ Allowed              ✅ Allowed
Internet → EC2 Instance (port 80) → ❌ BLOCKED (must go through ALB)
```

---

### 4. Application Load Balancer (ALB)

**What it is**: A highly available load balancer that distributes incoming traffic across multiple EC2 instances.

**Your ALB Details**:
- **Name**: `awseb--AWSEB-UXwwDwQyQeh2`
- **Type**: Application Load Balancer (Layer 7 - HTTP/HTTPS)
- **Scheme**: `internet-facing` (publicly accessible)
- **DNS**: `awseb--AWSEB-UXwwDwQyQeh2-1048967544.us-west-2.elb.amazonaws.com`
- **Public DNS**: `career-profile-tool.eba-y5huin4e.us-west-2.elasticbeanstalk.com` (CNAME)
- **Subnets**: Deployed in 4 AZs (us-west-2a, 2b, 2c, 2d)
- **Security Group**: `sg-0904b54e7b2350a76`

**Key Features**:
- **High Availability**: If one AZ fails, ALB continues serving from other AZs
- **Health Checks**: Monitors EC2 instance health every 30 seconds
- **Auto-scaling Support**: Automatically routes traffic to new instances when scaling up

**Cost**: ~$16/month + $0.008 per LCU-hour (Load Balancer Capacity Unit)

**Analogy**: Like a receptionist at a hotel who distributes guests (requests) to available rooms (EC2 instances).

---

### 5. Target Group

**What it is**: A logical grouping of EC2 instances that the ALB routes traffic to.

**Your Target Group Details**:
- **Name**: `awseb-AWSEB-FWDSWDXAPFS3`
- **Protocol**: HTTP
- **Port**: 80
- **Target**: Currently 1 instance (`i-0c4092e8cc57c59f9`)

**Health Check Configuration**:
```yaml
Path: /career-profile-tool/api/health
Interval: 30 seconds
Timeout: 10 seconds
Healthy Threshold: 2 successful checks
Unhealthy Threshold: 3 failed checks
Expected Response: HTTP 200
```

**How it works**:
1. ALB sends GET request to `http://35.90.36.181/career-profile-tool/api/health` every 30s
2. Backend FastAPI must respond with HTTP 200 within 10 seconds
3. After 2 consecutive successful checks → Instance marked "healthy"
4. After 3 consecutive failures → Instance marked "unhealthy" (removed from rotation)

**This matches your backend health endpoint**: `backend/src/api/main.py` (GET /career-profile-tool/api/health)

---

### 6. Auto Scaling Group (ASG)

**What it is**: Automatically adds or removes EC2 instances based on demand or health.

**Your ASG Details**:
- **Name**: `awseb-e-xeucub6m6k-stack-AWSEBAutoScalingGroup-C8nu4tIC1MTC`
- **Min Size**: 1 instance (always running)
- **Max Size**: 2 instances (can scale up to 2)
- **Current**: 1 instance running
- **Availability Zones**: us-west-2a, 2b, 2c
- **Health Check Type**: EC2 (instance-level checks)
- **Grace Period**: 0 seconds

**Configuration Source**: `.ebextensions/01_environment.config:18-20`
```yaml
aws:autoscaling:asg:
  MinSize: 1
  MaxSize: 2
```

**Scaling Behavior** (default):
- **No auto-scaling policies defined** = Manual scaling only
- If instance becomes unhealthy → ASG terminates it and launches replacement
- You can add CPU-based or request-based scaling policies later

**Analogy**: Like a hotel manager who hires more staff when busy and reduces staff when quiet.

---

### 7. Launch Template

**What it is**: Blueprint that defines how new EC2 instances should be configured.

**Your Launch Template**:
- **ID**: `lt-000916466118fc441`
- **Instance Type**: t3.medium
- **AMI**: Amazon Linux 2 (Docker platform)
- **Key Pair**: `career-profile-tool-keypair`
- **Security Group**: `sg-057f6c376577d68fa`
- **IAM Role**: `aws-elasticbeanstalk-ec2-role`
- **Root Volume**: 30GB gp3
- **User Data**: Script that installs Docker, pulls your application, runs docker-compose

**Configuration Source**: `.ebextensions/01_environment.config:11-16`

**What happens when ASG launches new instance**:
1. ASG uses this template to create new EC2 instance
2. Instance boots with Amazon Linux 2 + Docker pre-installed
3. EB agent downloads your app from S3 (`docker-compose.yml` + Dockerfiles)
4. Runs `.ebextensions` scripts
5. Starts containers via `docker compose up`

---

### 8. EC2 Instance (Compute)

**What it is**: Virtual server running your Docker containers.

**Your Instance Details**:
- **Instance ID**: `i-0c4092e8cc57c59f9`
- **Type**: `t3.medium`
  - **vCPUs**: 2 (Intel Xeon Scalable processors)
  - **RAM**: 4 GB
  - **Network**: Up to 5 Gbps
  - **EBS Bandwidth**: Up to 2,085 Mbps
- **State**: `running`
- **Public IPv4**: `35.90.36.181` (internet-accessible)
- **Private IPv4**: `172.31.39.174` (internal VPC communication)
- **Subnet**: `subnet-08e7745532a1e0ec2` (us-west-2b)
- **VPC**: `vpc-041cbc9a45cb2bcb8`
- **Security Group**: `sg-057f6c376577d68fa`

**What's running on it**:
```bash
Amazon Linux 2 (OS)
  ├─ Docker Engine
  │   ├─ Frontend Container (Nginx on port 80)
  │   ├─ Backend Container (Python/FastAPI on port 8000)
  │   └─ PostgreSQL Container (port 5432)
  ├─ Elastic Beanstalk Agent (manages deployments)
  ├─ CloudWatch Agent (streams logs)
  └─ Host Nginx (port 8080 for ALB health checks)
```

**Cost**: ~$30/month (us-west-2 pricing)

**Configuration Source**: `.ebextensions/01_environment.config:12`

---

### 9. EBS Volume (Storage) - gp3

**What it is**: Persistent block storage (hard drive) attached to your EC2 instance.

**Your Volume Details**:
- **Volume ID**: `vol-029248839fe3ec7e2`
- **Type**: `gp3` (General Purpose SSD - 3rd generation)
- **Size**: 30 GB
- **IOPS**: 3,000 (Input/Output Operations Per Second)
- **Throughput**: 125 MB/s
- **State**: `in-use` (attached to instance)
- **Availability Zone**: us-west-2b (same as EC2 instance)

**Performance Specs**:
```
gp3 Performance:
- Base: 3,000 IOPS, 125 MB/s (included in price)
- Max: 16,000 IOPS, 1,000 MB/s (additional cost)
- Latency: Single-digit milliseconds
```

**What's stored on it**:
```
/dev/xvda1 (30 GB root volume)
├─ /var/lib/docker/          (Docker images, containers)
│   ├─ containers/
│   ├─ volumes/
│   │   └─ postgres_data/    (PostgreSQL database cache)
│   └─ overlay2/             (container filesystems)
├─ /var/log/                 (application logs)
├─ /var/app/                 (Elastic Beanstalk app files)
└─ OS files                  (Amazon Linux 2)
```

**Data Persistence**:
- ✅ **Survives instance reboots**
- ✅ **Survives container restarts**
- ❌ **Does NOT survive instance termination** (unless you create snapshot)
- **PostgreSQL cache persists** across deployments thanks to Docker volumes (`.ebextensions/04_volumes.config`)

**Cost**: ~$2.40/month (30 GB × $0.08/GB-month)

**Configuration Source**: `.ebextensions/01_environment.config:15-16`
```yaml
RootVolumeSize: 30
RootVolumeType: gp3
```

**Comparison with other EBS types**:

| Type | Use Case | IOPS | Throughput | Cost |
|------|----------|------|------------|------|
| gp3 (yours) | General purpose, balanced | 3,000-16,000 | 125-1,000 MB/s | $0.08/GB |
| gp2 (older) | General purpose | 3-16,000 | 250 MB/s | $0.10/GB |
| io2 | High performance databases | 64,000+ | 4,000 MB/s | $0.125/GB + IOPS |
| st1 | Big data, data warehouses | 500 | 500 MB/s | $0.045/GB |

---

### 10. Elastic Beanstalk Environment

**What it is**: The orchestration layer that manages all these resources as a single unit.

**Your Environment**:
- **Application Name**: `career-profile-tool`
- **Environment Name**: `career-profile-tool`
- **Environment ID**: `e-xeucub6m6k`
- **Platform**: Docker running on 64bit Amazon Linux 2/3.6.5
- **Tier**: WebServer-Standard-1.0
- **CNAME**: `career-profile-tool.eba-y5huin4e.us-west-2.elasticbeanstalk.com`
- **Status**: Ready
- **Health**: Green ✅
- **Last Deployed**: app-251030_195453694427.zip

**What EB Environment does**:
1. **Provisioning**: Creates all AWS resources (ALB, ASG, EC2, Security Groups, etc.)
2. **Deployment**: Uploads your code, builds Docker images, starts containers
3. **Monitoring**: Tracks health, collects logs, sends CloudWatch metrics
4. **Scaling**: Adds/removes instances based on ASG configuration
5. **Updates**: Handles zero-downtime deployments (rolling updates)

**Environment Configuration** (from `.ebextensions/`):
- Application environment variables
- CloudWatch logging
- Nginx proxy settings
- Volume persistence
- ALB health checks

---

### 11. IAM Roles & Instance Profile

**What they are**: Permission sets that allow AWS services to interact with each other.

**EC2 Instance Role** (`aws-elasticbeanstalk-ec2-role`):
```
Allows EC2 instances to:
✅ Upload logs to CloudWatch
✅ Download application versions from S3
✅ Communicate with Elastic Beanstalk service
✅ Access other AWS services (if you add RDS, etc.)
```

**Service Role** (EB uses this to manage your environment):
```
Allows Elastic Beanstalk to:
✅ Create/modify EC2 instances
✅ Manage Load Balancers
✅ Configure Auto Scaling Groups
✅ Manage Security Groups
```

**Configuration Source**: `.ebextensions/01_environment.config:13`

---

### 12. CloudWatch Logs

**What it is**: Centralized log storage and monitoring service.

**Your Log Configuration**:
- **Log Group**: `/aws/elasticbeanstalk/free-profile-evaluation/docker`
- **Retention**: 7 days
- **Streaming**: Enabled (real-time)
- **Delete on Terminate**: False (logs persist after environment deletion)

**What gets logged**:
```
/var/log/eb-docker/containers/eb-current-app/
  ├─ frontend-container.log  (Nginx access/error logs)
  ├─ backend-container.log   (FastAPI uvicorn logs)
  └─ postgres-container.log  (PostgreSQL logs)
```

**Configuration Source**:
- `.ebextensions/01_environment.config:22-25` (basic streaming)
- `.ebextensions/02_cloudwatch.config` (CloudWatch agent config)

**Cost**: ~$5-10/month (depends on log volume)
- $0.50 per GB ingested
- $0.03 per GB stored (7 days retention = minimal cost)

---

### 13. S3 Bucket (Hidden)

**What it is**: Storage bucket where EB stores your application versions.

**Purpose**:
- When you run `eb deploy`, your app is zipped and uploaded to S3
- EC2 instances download the zip from S3 during deployment
- Old versions kept for rollback capability

**Your Application Versions** (local cache: `.elasticbeanstalk/app_versions/`):
```
app-251029_223122130224.zip
app-251029_225239692243.zip
app-251030_195453694427.zip  ← Currently deployed
... (11 versions total)
```

**S3 Bucket Name** (auto-generated): `elasticbeanstalk-us-west-2-555073836652`

**Cost**: ~$0.50-1/month for storing application versions

---

## Complete Request Flow

### Step-by-Step: User Submits Profile Evaluation Form

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER BROWSER                                             │
│    URL: career-profile-tool.eba-y5huin4e.us-west-2...com   │
│    Action: POST /career-profile-tool/api/evaluate          │
└─────────────────────────────────────────────────────────────┘
                            ↓ DNS Lookup
┌─────────────────────────────────────────────────────────────┐
│ 2. ROUTE 53 (DNS)                                           │
│    Resolves CNAME to ALB DNS                                │
│    → awseb--AWSEB-...elb.amazonaws.com                      │
└─────────────────────────────────────────────────────────────┘
                            ↓ TCP Connection
┌─────────────────────────────────────────────────────────────┐
│ 3. APPLICATION LOAD BALANCER                                │
│    Public IP: (Multiple IPs in 4 AZs)                      │
│    Security Check: Port 80 allowed? ✅                      │
│    Target Selection: Pick healthy instance from Target Grp │
│    → Instance i-0c4092e8cc57c59f9 (35.90.36.181)           │
└─────────────────────────────────────────────────────────────┘
                            ↓ Forward to EC2
┌─────────────────────────────────────────────────────────────┐
│ 4. EC2 INSTANCE (i-0c4092e8cc57c59f9)                      │
│    Security Check: From ALB SG? ✅                          │
│    Private IP: 172.31.39.174                                │
│    Port 80 receives request                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓ Into Docker Network
┌─────────────────────────────────────────────────────────────┐
│ 5. FRONTEND CONTAINER (Nginx)                               │
│    Port 80 inside container                                 │
│    nginx.conf:17-31                                         │
│    Path match: /career-profile-tool/api/ → proxy_pass      │
│    → Forwards to backend:8000                               │
└─────────────────────────────────────────────────────────────┘
                            ↓ Docker Network (app-network)
┌─────────────────────────────────────────────────────────────┐
│ 6. BACKEND CONTAINER (FastAPI)                              │
│    Port 8000 inside container                               │
│    FastAPI Route: POST /career-profile-tool/api/evaluate   │
│    Handler: src/api/main.py:evaluate_profile()             │
│                                                              │
│    6a. Generate cache key (SHA256 hash of payload)          │
│    6b. Query PostgreSQL: Check if hash exists               │
└─────────────────────────────────────────────────────────────┘
                            ↓ Database Query
┌─────────────────────────────────────────────────────────────┐
│ 7. POSTGRESQL CONTAINER                                     │
│    Port 5432 inside container                               │
│    Database: profile_cache                                  │
│    Table: response_cache                                    │
│    Query: SELECT response_json WHERE cache_key=?            │
│                                                              │
│    Storage: Docker Volume → /var/lib/docker/volumes/...    │
│              ↓ (persisted on)                               │
│            EBS Volume (vol-029248839fe3ec7e2)               │
│            30GB gp3, 3000 IOPS                              │
└─────────────────────────────────────────────────────────────┘
                    ↓ If Cache MISS
┌─────────────────────────────────────────────────────────────┐
│ 8. OPENAI API (External)                                    │
│    Backend makes HTTPS request to api.openai.com            │
│    Model: gpt-4                                             │
│    Function: call_openai_structured()                       │
│    src/services/run_poc.py                                  │
│                                                              │
│    ← Receives structured JSON response                      │
└─────────────────────────────────────────────────────────────┘
                    ↓ Store Response
┌─────────────────────────────────────────────────────────────┐
│ 9. SAVE TO CACHE                                            │
│    PostgreSQL INSERT: cache_key, model, response_json       │
│    Future requests with same payload → Instant response     │
│    Cost savings: 50-99%                                     │
└─────────────────────────────────────────────────────────────┘
                    ↓ Response Journey Back
┌─────────────────────────────────────────────────────────────┐
│ 10. RESPONSE PATH (Reverse)                                 │
│     Backend → Frontend Nginx → EC2 → ALB → User Browser    │
│     JSON response with profile evaluation                   │
│     Status: 200 OK                                          │
└─────────────────────────────────────────────────────────────┘
```

### Timeline (Typical Request)

```
Cache HIT:  50-100ms  (PostgreSQL lookup only)
Cache MISS: 5-15 seconds (OpenAI API call + database write)
```

---

## Monitoring & Health Checks

### Health Check Flow (Every 30 seconds)

```
ALB Health Check Loop:
  ↓
GET http://35.90.36.181/career-profile-tool/api/health
  ↓
Frontend Nginx: Proxy to backend:8000/career-profile-tool/api/health
  ↓
Backend FastAPI: Return {"status": "healthy"}
  ↓
ALB Evaluates:
  - Response Code: 200? ✅
  - Response Time: <10s? ✅
  - Consecutive Successes: 2+ → HEALTHY
  - Consecutive Failures: 3+ → UNHEALTHY
```

### Instance Failure Recovery

**If instance becomes UNHEALTHY**:
1. ALB stops routing traffic to instance
2. Auto Scaling Group detects unhealthy instance
3. ASG terminates bad instance
4. ASG launches replacement instance from Launch Template
5. New instance registers with Target Group
6. After 2 health checks pass → New instance receives traffic

**Total recovery time**: ~3-5 minutes

---

## Cost Breakdown

Based on your actual configuration (us-west-2 pricing):

| Component | Details | Monthly Cost |
|-----------|---------|--------------|
| **EC2 Instance** | t3.medium, 1 instance 24/7 | $30.37 |
| **EBS Volume** | 30GB gp3 @ $0.08/GB | $2.40 |
| **Application Load Balancer** | Base + 1 LCU | $16.20 + ~$5 |
| **Data Transfer** | First 100GB free, then $0.09/GB | Variable |
| **CloudWatch Logs** | Ingestion + 7-day storage | ~$5-10 |
| **S3 Storage** | Application versions | ~$0.50 |
| **Auto Scaling** | No charge (uses EC2 costs) | $0 |
| **Elastic Beanstalk** | Free (management service) | $0 |
| **Target Group** | Included with ALB | $0 |
| **Security Groups** | Free | $0 |
| **VPC** | Free (default VPC) | $0 |

**Estimated Total**: **$59-70/month** (excluding OpenAI API costs)

### If you scale to 2 instances:
- Add 1 t3.medium: +$30.37
- Add 1 EBS volume: +$2.40
- **Total**: ~$92-105/month

---

## Security Architecture

### Network Security (Defense in Depth)

```
Layer 1: Internet → ALB
  ✅ Security Group: Only port 80 allowed
  ✅ DDoS Protection: AWS Shield Standard (free)

Layer 2: ALB → EC2 Instance
  ✅ Security Group: Only ALB security group allowed
  ✅ Private communication within VPC

Layer 3: EC2 → Containers
  ✅ Docker network isolation
  ✅ Containers can't be accessed directly from internet

Layer 4: Container → Container
  ✅ Internal Docker network (app-network)
  ✅ PostgreSQL only accessible from backend container
```

### Access Control

```
SSH Access:
  ✅ Port 22 open from 0.0.0.0/0
  ✅ Requires private key: career-profile-tool-keypair.pem
  ⚠️  You can restrict to your IP for better security

IAM Roles:
  ✅ EC2 instances can't modify infrastructure
  ✅ Least privilege principle applied
  ✅ No AWS credentials stored on instances
```

### Data Security

```
In-Transit:
  ⚠️  Currently HTTP only (port 80)
  💡 Recommendation: Add HTTPS listener on ALB (port 443)

At-Rest:
  ⚠️  EBS volume not encrypted
  💡 Recommendation: Enable EBS encryption

Database:
  ✅ PostgreSQL isolated in Docker network
  ✅ Only backend can connect
  ⚠️  Data in plaintext in database
```

---

## Scaling Behavior

### Current Configuration

```
Min: 1 instance
Max: 2 instances
Scaling Policy: NONE (manual only)
```

### What triggers scaling

Currently: **Nothing automatic** (you'd need to manually run `eb scale 2`)

### To enable auto-scaling

Add to `.ebextensions/`:

```yaml
# Example: Scale based on CPU
option_settings:
  aws:autoscaling:trigger:
    MeasureName: CPUUtilization
    Statistic: Average
    Unit: Percent
    UpperThreshold: 70
    LowerThreshold: 30
    BreachDuration: 5
    Period: 5
    EvaluationPeriods: 1
    UpperBreachScaleIncrement: 1
    LowerBreachScaleIncrement: -1
```

### Scaling Timeline

```
Scale UP (1 → 2 instances):
1. ASG launches new EC2 instance (2-3 min)
2. Instance boots + Docker containers start (2-3 min)
3. Health checks pass (1-2 min)
4. ALB adds to Target Group
Total: ~5-8 minutes

Scale DOWN (2 → 1 instances):
1. ASG selects instance to terminate
2. ALB drains connections (default 300s)
3. Instance terminated
Total: ~5-6 minutes
```

---

## Resource Relationships

```
                    AWS ACCOUNT (555073836652)
                              |
        ┌─────────────────────┴─────────────────────┐
        │                                           │
   REGION: us-west-2                         IAM ROLES
        │                                           │
        ├─ VPC (vpc-041cbc9a45cb2bcb8)            │
        │   CIDR: 172.31.0.0/16                    │
        │   │                                       │
        │   ├─ Subnet (us-west-2a) ──┐            │
        │   ├─ Subnet (us-west-2b) ──┼───┐        │
        │   ├─ Subnet (us-west-2c) ──┤   │        │
        │   └─ Subnet (us-west-2d) ──┘   │        │
        │                                 │        │
        ├─ ELASTIC BEANSTALK              │        │
        │   Application: career-profile-tool      │
        │   Environment: career-profile-tool      │
        │        │                                 │
        │        ├─ S3 BUCKET ─────────────┐      │
        │        │  (Application Versions)  │      │
        │        │                          │      │
        │        └─ CloudWatch Logs         │      │
        │           (/aws/elasticbeanstalk/...)   │
        │                                   │      │
        ├─ APPLICATION LOAD BALANCER       │      │
        │   Name: awseb--AWSEB-...         │      │
        │   Subnets: All 4 AZs ───────────┘      │
        │   Security Group: sg-0904b54e7b2350a76  │
        │   │                                      │
        │   └─ TARGET GROUP                        │
        │       Name: awseb-AWSEB-...             │
        │       Health Check: /career-profile.../health
        │       │                                   │
        │       └─ Registered Instances ───────┐  │
        │                                       │  │
        ├─ AUTO SCALING GROUP                  │  │
        │   Min: 1, Max: 2                     │  │
        │   AZs: us-west-2a, 2b, 2c           │  │
        │   │                                   │  │
        │   └─ LAUNCH TEMPLATE ────────────┐   │  │
        │       Instance Type: t3.medium    │   │  │
        │       AMI: Amazon Linux 2         │   │  │
        │       IAM Role: ec2-role ◄───────┼───┘  │
        │       Security Group: sg-057f... │      │
        │       │                           │      │
        │       └─ EC2 INSTANCE ◄───────────┘      │
        │           ID: i-0c4092e8cc57c59f9        │
        │           Public IP: 35.90.36.181        │
        │           Private IP: 172.31.39.174      │
        │           Subnet: us-west-2b             │
        │           │                               │
        │           ├─ EBS VOLUME                  │
        │           │   ID: vol-029248839fe3ec7e2  │
        │           │   Type: gp3, 30GB            │
        │           │   IOPS: 3000                 │
        │           │                               │
        │           └─ DOCKER ENGINE               │
        │               Network: app-network       │
        │               │                           │
        │               ├─ FRONTEND (Nginx:80)    │
        │               ├─ BACKEND (FastAPI:8000) │
        │               └─ POSTGRESQL (5432)      │
        │                   Volume: postgres_data  │
        └───────────────────────────────────────────
```

---

## Key Concepts Explained

### VPC = Your Private Island
All your AWS resources live on this private island. No one else can access it unless you allow them.

### Subnets = Neighborhoods on the Island
Your island has 4 neighborhoods (subnets), each in a different location. If an earthquake destroys one neighborhood, the other 3 still work.

### Security Groups = Bodyguards
Each resource has bodyguards (security groups) that check IDs. "Are you the Load Balancer? Come in. Are you a random stranger? Go away."

### Load Balancer = Traffic Cop
Stands at the entrance to your island and directs incoming cars (requests) to available parking spaces (EC2 instances).

### Auto Scaling Group = Self-Healing System
If a server dies, ASG automatically builds a new one. If traffic increases, it adds more servers. Like a self-repairing robot army.

### Target Group = Parking Lot
Collection of parking spaces (instances) where the Traffic Cop (ALB) sends cars (requests). Empty spaces get filled, broken spaces get removed.

### EC2 Instance = Physical Server
A computer running in AWS data center. Your Docker containers live here.

### EBS Volume = Hard Drive
Persistent storage attached to your server. Survives restarts but not server termination (unless you snapshot it).

### Docker Containers = Isolated Apps
Think of them as separate apartments in a building (EC2 instance). Each app lives in its own apartment with its own utilities, but they share the building's infrastructure.

---

## Troubleshooting

### Instance failing health checks?

```bash
# Check backend health endpoint
eb ssh
curl http://localhost/career-profile-tool/api/health

# Check container logs
docker logs career-profile-backend
docker logs career-profile-frontend
docker logs career-profile-db
```

### Database connection errors?

```bash
eb ssh
docker exec -it career-profile-db psql -U postgres -d profile_cache
# Check if database is accessible
```

### High costs?

1. Check CloudWatch Logs retention (reduce from 7 to 3 days)
2. Consider t3.small instead of t3.medium (saves $15/month)
3. Use Spot Instances for dev environments
4. Enable EBS volume snapshots lifecycle policy

### Need HTTPS?

1. Request ACM certificate in AWS Console
2. Add HTTPS listener to ALB (port 443)
3. Configure HTTP → HTTPS redirect
4. No code changes needed!

---

## Summary

Your `eb create` command created **13 interconnected AWS resources**:

1. ✅ **VPC** - Your private network (reused existing default VPC)
2. ✅ **4 Subnets** - Spread across 4 Availability Zones
3. ✅ **2 Security Groups** - Firewalls for ALB and EC2
4. ✅ **Application Load Balancer** - Public-facing traffic distributor
5. ✅ **Target Group** - Logical grouping of instances with health checks
6. ✅ **Auto Scaling Group** - Self-healing and scaling orchestrator
7. ✅ **Launch Template** - Blueprint for new instances
8. ✅ **EC2 Instance** - Virtual server running your Docker containers
9. ✅ **EBS Volume (gp3)** - 30GB persistent storage
10. ✅ **IAM Roles** - Permissions for EC2 and EB service
11. ✅ **CloudWatch Logs** - Centralized log storage
12. ✅ **S3 Bucket** - Application version storage
13. ✅ **Elastic Beanstalk Environment** - Orchestration layer managing everything

**Total Monthly Cost**: ~$59-70 (1 instance) or ~$92-105 (2 instances)

All these components work together to provide a **production-ready, highly available, auto-healing infrastructure** for your AI-powered career evaluation tool!

---

## Quick Reference Commands

```bash
# View environment status
eb status

# Deploy updates
eb deploy

# View logs
eb logs --stream

# SSH into instance
eb ssh

# Scale instances
eb scale 2

# Check environment health
eb health

# View CloudWatch logs
aws logs tail /aws/elasticbeanstalk/free-profile-evaluation/docker --follow

# Check running containers
eb ssh
docker ps
docker logs <container-name>

# Access database
eb ssh
docker exec -it career-profile-db psql -U postgres -d profile_cache
```
