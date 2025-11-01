# VPC (Virtual Private Cloud) - Complete Deep Dive

## Table of Contents
- [What is a VPC?](#what-is-a-vpc)
- [Why Do We Need VPC?](#why-do-we-need-vpc)
- [Your VPC Details](#your-vpc-details)
- [VPC Core Components](#vpc-core-components)
- [How VPC Works](#how-vpc-works)
- [IP Addressing & CIDR](#ip-addressing--cidr)
- [Network Traffic Flow](#network-traffic-flow)
- [VPC vs Traditional Network](#vpc-vs-traditional-network)
- [Security Layers in VPC](#security-layers-in-vpc)
- [Default VPC vs Custom VPC](#default-vpc-vs-custom-vpc)
- [Real-World Analogies](#real-world-analogies)
- [Advanced VPC Concepts](#advanced-vpc-concepts)

---

## What is a VPC?

**VPC (Virtual Private Cloud)** is your **own isolated, private network in AWS cloud**. Think of it as your personal data center in the cloud that only you control.

### Simple Definition
A VPC is like having your own private section of the internet where:
- You control **who can enter** (security)
- You control **how traffic flows** (routing)
- You decide **how resources communicate** (networking)
- It's completely **isolated** from other AWS customers

### Technical Definition
A logically isolated virtual network in AWS cloud where you can:
- Launch AWS resources (EC2, RDS, Lambda, etc.)
- Define IP address ranges
- Create subnets
- Configure route tables
- Set up network gateways
- Control inbound/outbound traffic with security rules

---

## Why Do We Need VPC?

### 1. **Isolation & Security**
Without VPC, all AWS customers would share the same network (massive security risk!). VPC ensures:
- Your EC2 instances can't be accessed by other AWS customers
- Your database is isolated from the public internet
- You control every network connection

### 2. **Control**
VPC gives you complete control over:
- IP address ranges (CIDR blocks)
- Subnets (public vs private)
- Routing (how traffic flows)
- Security (firewalls, access control)

### 3. **Hybrid Cloud**
Connect your VPC to:
- Your on-premises data center (via VPN or Direct Connect)
- Other VPCs (via VPC Peering)
- AWS services (via VPC Endpoints)

### 4. **Compliance**
Many regulations (HIPAA, PCI-DSS, SOC2) require network isolation, which VPC provides.

---

## Your VPC Details

### Basic Information

```yaml
VPC ID: vpc-041cbc9a45cb2bcb8
Name: Default VPC (automatically created by AWS)
Region: us-west-2 (Oregon)
CIDR Block: 172.31.0.0/16
Owner: Your AWS Account (555073836652)
State: available
Instance Tenancy: default (shared hardware)
DNS Hostnames: Enabled
DNS Resolution: Enabled
```

### What This Means

**CIDR Block: 172.31.0.0/16**
- Your VPC has **65,536 IP addresses** available (172.31.0.0 to 172.31.255.255)
- This is your "private address space" - these IPs only work inside your VPC
- AWS reserves 5 IPs per subnet for internal use

**Default VPC**
- AWS automatically creates one default VPC per region
- Pre-configured with subnets, internet gateway, route tables
- Ready to use immediately (no setup required)
- Your Elastic Beanstalk deployment uses this default VPC

**Instance Tenancy: default**
- Your EC2 instances run on shared AWS hardware (cost-effective)
- Alternative: "dedicated" = instances run on dedicated hardware (more expensive, compliance requirement)

---

## VPC Core Components

Your VPC consists of several interconnected components:

```
┌─────────────────────────────────────────────────────────────┐
│                    VPC (172.31.0.0/16)                      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Internet Gateway (igw-0e75f2b82f22cdbde)  │ │
│  │          (Gateway to the public internet)              │ │
│  └───────────────────────┬────────────────────────────────┘ │
│                          │                                   │
│  ┌───────────────────────▼────────────────────────────────┐ │
│  │              Route Table (rtb-0b38e6cec81a05519)       │ │
│  │  Rule 1: 172.31.0.0/16 → local (within VPC)          │ │
│  │  Rule 2: 0.0.0.0/0 → igw-xxx (internet traffic)      │ │
│  └───────────────────────┬────────────────────────────────┘ │
│                          │                                   │
│         ┌────────────────┼────────────────┐                 │
│         │                │                │                 │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼───────┐        │
│  │   Subnet A  │  │   Subnet B  │  │  Subnet C   │  ...   │
│  │ us-west-2a  │  │ us-west-2b  │  │ us-west-2c  │        │
│  │172.31.16.0  │  │172.31.32.0  │  │172.31.0.0   │        │
│  │    /20      │  │    /20      │  │    /20      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│         │                │                │                 │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼───────┐        │
│  │ EC2 Instance│  │     ALB     │  │  Resources  │        │
│  │   (Your     │  │  (Multi-AZ) │  │             │        │
│  │  Backend)   │  │             │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Network ACL (acl-0ea7d5784e58dfb85)           │ │
│  │         (Subnet-level firewall - ALLOW ALL)            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Security Groups (Instance-level firewalls)     │ │
│  │         - sg-057f6c376577d68fa (EC2 instances)        │ │
│  │         - sg-0904b54e7b2350a76 (Load Balancer)        │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

Let's break down each component:

---

### 1. Internet Gateway (IGW)

**What it is**: The door between your VPC and the public internet.

**Your IGW**: `igw-0e75f2b82f22cdbde`

**How it works**:
```
User on Internet (Public IP: 203.0.113.5)
         ↓
Internet Gateway (igw-0e75f2b82f22cdbde)
         ↓ (NAT: translates Public IP ↔ Private IP)
EC2 Instance (Private IP: 172.31.39.174, Public IP: 35.90.36.181)
```

**Key Functions**:
1. **NAT (Network Address Translation)**: Translates between public and private IPs
2. **Route Internet Traffic**: Routes traffic from internet to your resources
3. **Stateless**: Doesn't track connections (that's security group's job)
4. **Horizontally Scaled**: Automatically handles any traffic volume

**Without IGW**: Your resources can't communicate with the internet (no inbound/outbound traffic)

**Analogy**: Like a post office that translates between your home address (private IP) and a PO Box (public IP).

---

### 2. Route Tables

**What it is**: A set of rules that determine where network traffic goes.

**Your Route Table**: `rtb-0b38e6cec81a05519`

**Current Routing Rules**:

| Destination | Target | Meaning |
|------------|--------|---------|
| 172.31.0.0/16 | local | Traffic within VPC stays local |
| 0.0.0.0/0 | igw-0e75f2b82f22cdbde | All other traffic goes to internet |

**How it works**:

```
Scenario 1: EC2 wants to talk to another EC2 in same VPC
Source: 172.31.39.174
Destination: 172.31.40.100
Route Table Check: 172.31.40.100 matches 172.31.0.0/16 → local
Result: Traffic stays within VPC (no internet gateway)

Scenario 2: EC2 wants to call OpenAI API
Source: 172.31.39.174
Destination: api.openai.com (104.18.7.192)
Route Table Check: 104.18.7.192 matches 0.0.0.0/0 → igw-xxx
Result: Traffic goes through Internet Gateway
```

**Types of Route Tables**:
- **Main Route Table**: Default for all subnets (yours is the main one)
- **Custom Route Tables**: Can create specific routes for different subnets

**Analogy**: Like a GPS that tells traffic which road to take.

---

### 3. Subnets

**What they are**: Subdivisions of your VPC that segment your network.

**Your 4 Subnets**:

```
Subnet 1 (us-west-2a):
  - ID: subnet-06cb88e83463cf746
  - CIDR: 172.31.16.0/20
  - Available IPs: 4,096 (actually 4,091 after AWS reserves 5)
  - Type: Public (has route to Internet Gateway)
  - Availability Zone: us-west-2a

Subnet 2 (us-west-2b):  ← YOUR EC2 INSTANCE IS HERE
  - ID: subnet-08e7745532a1e0ec2
  - CIDR: 172.31.32.0/20
  - Available IPs: 4,096
  - Type: Public
  - Availability Zone: us-west-2b
  - Resources: Your EC2 instance (i-0c4092e8cc57c59f9)

Subnet 3 (us-west-2c):
  - ID: subnet-0f45435632ad2cc87
  - CIDR: 172.31.0.0/20
  - Available IPs: 4,096
  - Type: Public
  - Availability Zone: us-west-2c

Subnet 4 (us-west-2d):
  - ID: subnet-0010e3c8a69f7760f
  - CIDR: 172.31.48.0/20
  - Available IPs: 4,096
  - Type: Public
  - Availability Zone: us-west-2d
```

**Public vs Private Subnets**:

```
PUBLIC SUBNET (yours):
✅ Has route to Internet Gateway (0.0.0.0/0 → igw-xxx)
✅ Resources can get public IP addresses
✅ Can communicate with internet directly
Use case: Web servers, Load Balancers, Bastion hosts

PRIVATE SUBNET (not in your setup):
❌ No direct route to Internet Gateway
❌ Resources have private IPs only
✅ Can access internet via NAT Gateway (outbound only)
Use case: Databases, Application servers, Internal services
```

**Why Multiple Subnets?**:
1. **High Availability**: If us-west-2b data center fails, ALB uses other AZs
2. **Fault Tolerance**: ALB is deployed across all 4 subnets
3. **Geographic Distribution**: Reduces latency for users

**Analogy**: Like different neighborhoods in a city, each in a different part of town.

---

### 4. Network ACLs (NACLs)

**What they are**: Subnet-level firewall that controls traffic in/out of subnets.

**Your NACL**: `acl-0ea7d5784e58dfb85`

**Current Rules**:

```
INBOUND RULES:
Rule 100: Allow ALL traffic from 0.0.0.0/0 (entire internet)
Rule 32767: Deny ALL (default fallback, never reached)

OUTBOUND RULES:
Rule 100: Allow ALL traffic to 0.0.0.0/0 (entire internet)
Rule 32767: Deny ALL (default fallback, never reached)
```

**How NACLs Work**:

```
Internet → NACL (Subnet level) → Security Group (Instance level) → EC2 Instance
           ↑                      ↑
           Stateless              Stateful
           (checks both ways)     (remembers connections)
```

**NACL vs Security Group**:

| Feature | NACL | Security Group |
|---------|------|----------------|
| **Level** | Subnet (all resources in subnet) | Instance (specific resource) |
| **State** | Stateless (must allow both inbound & outbound) | Stateful (auto-allows return traffic) |
| **Rules** | Allow & Deny rules | Allow rules only |
| **Evaluation** | Rules processed in order | All rules evaluated |
| **Default** | Allow all traffic | Deny all traffic (must explicitly allow) |

**Your Setup**: Default NACL allows everything, Security Groups do the actual filtering.

**Analogy**:
- **NACL** = Neighborhood checkpoint (checks everyone entering/leaving)
- **Security Group** = Individual house locks (specific to each house)

---

### 5. Security Groups

**What they are**: Instance-level firewall (covered in detail in AWS_INFRASTRUCTURE.md).

**Your Security Groups**:
- `sg-0904b54e7b2350a76` - ALB Security Group (allows port 80 from internet)
- `sg-057f6c376577d68fa` - EC2 Security Group (allows port 80 from ALB only)

**Key Point**: Security Groups are **stateful** - if you allow inbound traffic, the response is automatically allowed outbound.

---

## How VPC Works

### Complete Network Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    THE INTERNET                               │
│                  (Public IP Space)                            │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ User Request
                         │ Destination: career-profile-tool.eba-y5huin4e...com
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                  AWS EDGE LOCATION                            │
│                  (Route 53 DNS)                               │
│  Resolves: eba-y5huin4e...com → ALB IP                       │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ↓
┌──────────────────────────────────────────────────────────────┐
│           INTERNET GATEWAY (igw-0e75f2b82f22cdbde)           │
│  - Attached to VPC vpc-041cbc9a45cb2bcb8                     │
│  - Performs NAT: Public IP ↔ Private IP                      │
│  - Entry/Exit point for internet traffic                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         │ Enters VPC
                         ↓
┌──────────────────────────────────────────────────────────────┐
│                VPC: vpc-041cbc9a45cb2bcb8                     │
│                CIDR: 172.31.0.0/16                            │
│                                                               │
│  ┌────────────────────┴───────────────────────┐             │
│  │    Route Table (rtb-0b38e6cec81a05519)     │             │
│  │  Check: Destination IP matches which rule? │             │
│  │  - 172.31.0.0/16 → local                   │             │
│  │  - 0.0.0.0/0 → igw-xxx                     │             │
│  └────────────────────┬───────────────────────┘             │
│                       │                                       │
│                       │ Routes to ALB subnet                  │
│                       ↓                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SUBNET: us-west-2b (subnet-08e7745532a1e0ec2)       │   │
│  │  CIDR: 172.31.32.0/20                                 │   │
│  │                                                        │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  Network ACL (acl-0ea7d5784e58dfb85)        │   │   │
│  │  │  Inbound: Allow ALL from 0.0.0.0/0          │   │   │
│  │  │  Check: Port 80? Source IP? ✅ ALLOW        │   │   │
│  │  └──────────────────┬───────────────────────────┘   │   │
│  │                     │                                 │   │
│  │                     ↓                                 │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  ALB (awseb--AWSEB-UXwwDwQyQeh2)            │   │   │
│  │  │  Security Group: sg-0904b54e7b2350a76       │   │   │
│  │  │  Inbound Rule: Port 80 from 0.0.0.0/0 ✅    │   │   │
│  │  │  Checks Target Group health                  │   │   │
│  │  │  Selects healthy instance                    │   │   │
│  │  └──────────────────┬───────────────────────────┘   │   │
│  │                     │                                 │   │
│  │                     │ Forwards to EC2                 │   │
│  │                     ↓                                 │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │  EC2: i-0c4092e8cc57c59f9                    │   │   │
│  │  │  Private IP: 172.31.39.174                   │   │   │
│  │  │  Public IP: 35.90.36.181                     │   │   │
│  │  │  Security Group: sg-057f6c376577d68fa        │   │   │
│  │  │  Inbound: Port 80 from sg-0904b54... ✅     │   │   │
│  │  │                                               │   │   │
│  │  │  ┌─────────────────────────────────────┐   │   │   │
│  │  │  │  Docker Network (app-network)       │   │   │   │
│  │  │  │  172.18.0.0/16 (internal)          │   │   │   │
│  │  │  │                                      │   │   │   │
│  │  │  │  - Frontend:  172.18.0.2:80        │   │   │   │
│  │  │  │  - Backend:   172.18.0.3:8000      │   │   │   │
│  │  │  │  - PostgreSQL: 172.18.0.4:5432     │   │   │   │
│  │  │  └─────────────────────────────────────┘   │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Other Subnets: us-west-2a, 2c, 2d (for ALB HA)             │
└──────────────────────────────────────────────────────────────┘
```

### Step-by-Step Traffic Flow

**Outbound Traffic (EC2 → Internet, e.g., calling OpenAI API)**:

```
1. Backend Container (172.18.0.3) → OpenAI API
   ↓
2. Docker Network routes to Host EC2 (172.31.39.174)
   ↓
3. EC2 Security Group (sg-057f...) checks outbound rules ✅ (Allow all)
   ↓
4. Subnet NACL checks outbound rules ✅ (Allow all)
   ↓
5. Route Table: Destination api.openai.com matches 0.0.0.0/0 → IGW
   ↓
6. Internet Gateway performs NAT:
   Source: 172.31.39.174 (private) → 35.90.36.181 (public)
   ↓
7. Traffic exits to Internet → api.openai.com
```

**Inbound Traffic (Internet → EC2)**:

```
1. User Request → ALB DNS
   ↓
2. Internet Gateway receives traffic
   ↓
3. Route Table directs to appropriate subnet
   ↓
4. Subnet NACL checks inbound rules ✅
   ↓
5. ALB Security Group checks port 80 ✅
   ↓
6. ALB forwards to EC2 private IP (172.31.39.174)
   ↓
7. EC2 Security Group checks source = ALB SG ✅
   ↓
8. Traffic reaches EC2 → Docker containers
```

---

## IP Addressing & CIDR

### What is CIDR?

**CIDR (Classless Inter-Domain Routing)**: A way to represent IP address ranges.

**Format**: `IP_ADDRESS/PREFIX_LENGTH`

**Your VPC CIDR**: `172.31.0.0/16`

### Understanding CIDR Notation

```
172.31.0.0/16
│   │  │ │ │
│   │  │ │ └─ /16 = First 16 bits are network, remaining 16 bits are host
│   │  │ └─── 4th octet (0-255)
│   │  └───── 3rd octet (0-255)
│   └──────── 2nd octet (31 is fixed)
└──────────── 1st octet (172 is fixed)

Fixed Part:     172.31.X.X
Variable Part:  X.X (can be 0-255 each)
Total IPs:      256 × 256 = 65,536 IP addresses
```

### CIDR Block Sizes

| CIDR | Subnet Mask | Total IPs | Usable IPs* | Use Case |
|------|-------------|-----------|-------------|----------|
| /32 | 255.255.255.255 | 1 | 1 | Single host |
| /28 | 255.255.255.240 | 16 | 11 | Small subnet |
| /24 | 255.255.255.0 | 256 | 251 | Standard subnet |
| /20 | 255.255.240.0 | 4,096 | 4,091 | Your subnets |
| /16 | 255.255.0.0 | 65,536 | 65,531 | Your VPC |
| /8 | 255.0.0.0 | 16,777,216 | ~16M | Very large network |

*AWS reserves 5 IPs per subnet:
- `.0` = Network address
- `.1` = VPC router
- `.2` = DNS server
- `.3` = Reserved for future use
- `.255` = Broadcast address (AWS doesn't support broadcast, but reserves it)

### IP Address Ranges

**Your VPC**: `172.31.0.0/16`

```
Start IP:  172.31.0.0
End IP:    172.31.255.255
Total:     65,536 addresses

Breakdown:
172.31.0.0    - 172.31.15.255   → Subnet us-west-2c (4,096 IPs)
172.31.16.0   - 172.31.31.255   → Subnet us-west-2a (4,096 IPs)
172.31.32.0   - 172.31.47.255   → Subnet us-west-2b (4,096 IPs) ← Your EC2
172.31.48.0   - 172.31.63.255   → Subnet us-west-2d (4,096 IPs)
172.31.64.0   - 172.31.255.255  → Available for more subnets
```

### Private IP Ranges (RFC 1918)

These IP ranges are reserved for private networks (not routable on public internet):

```
Class A: 10.0.0.0/8          (10.0.0.0 - 10.255.255.255)    16 million IPs
Class B: 172.16.0.0/12       (172.16.0.0 - 172.31.255.255)  1 million IPs ← YOUR VPC
Class C: 192.168.0.0/16      (192.168.0.0 - 192.168.255.255) 65,536 IPs
```

**Your VPC uses Class B private range**: `172.31.0.0/16`

---

## Network Traffic Flow

### Scenario 1: User Visits Website

```
User Browser (Public IP: 203.0.113.45)
  ↓ HTTP GET request
Internet Gateway (igw-0e75f2b82f22cdbde)
  ↓ NAT translation
ALB Security Group (sg-0904b54e7b2350a76)
  ✅ Check: Port 80 from 0.0.0.0/0 → ALLOW
  ↓
Application Load Balancer (Multiple public IPs across 4 AZs)
  ↓ Health check passed, forward to target
EC2 Security Group (sg-057f6c376577d68fa)
  ✅ Check: Port 80 from ALB SG → ALLOW
  ↓
EC2 Instance (Private IP: 172.31.39.174)
  ↓ Local docker network
Frontend Container (172.18.0.2:80)
```

### Scenario 2: Backend Calls OpenAI API

```
Backend Container (172.18.0.3:8000)
  ↓ HTTPS request to api.openai.com
Docker Bridge Network (172.18.0.1)
  ↓ Route to host
EC2 Instance (Private IP: 172.31.39.174)
  ↓ Security Group egress ✅ (Allow all outbound)
VPC Route Table
  ✅ Check: api.openai.com (104.18.7.192) matches 0.0.0.0/0 → igw-xxx
  ↓
Internet Gateway (igw-0e75f2b82f22cdbde)
  ↓ NAT: 172.31.39.174 → 35.90.36.181 (public IP)
Internet → api.openai.com
```

### Scenario 3: Database Query (Container to Container)

```
Backend Container (172.18.0.3:8000)
  ↓ PostgreSQL connection
Docker Network (app-network)
  ↓ Internal routing (stays within container network)
PostgreSQL Container (172.18.0.4:5432)
  ✅ No VPC routing involved (container-to-container)
```

**Key Point**: Container-to-container communication happens entirely within Docker network, never leaves the EC2 instance.

---

## VPC vs Traditional Network

### Traditional Data Center

```
┌────────────────────────────────────────┐
│         Your Physical Data Center      │
│                                         │
│  - Buy physical servers ($10K-50K each)│
│  - Buy network switches ($5K-20K)      │
│  - Configure routers                    │
│  - Hire network engineers              │
│  - Cable everything manually           │
│  - Wait weeks for hardware delivery    │
│  - Physical security (guards, locks)   │
│  - Redundant power, cooling, internet  │
│                                         │
│  Cost: $500K-1M initial setup          │
│  Time: 3-6 months to operational       │
└────────────────────────────────────────┘
```

### AWS VPC (Your Setup)

```
┌────────────────────────────────────────┐
│         AWS VPC (Cloud)                │
│                                         │
│  - Click "Create VPC" (or use default) │
│  - Launch virtual servers in seconds   │
│  - Software-defined networking         │
│  - AWS manages physical infrastructure │
│  - Scale up/down instantly             │
│  - Pay only for what you use           │
│  - Built-in redundancy & security      │
│  - Global availability (25+ regions)   │
│                                         │
│  Cost: ~$60-70/month (pay as you go)   │
│  Time: 5 minutes to operational        │
└────────────────────────────────────────┘
```

### Key Differences

| Aspect | Traditional Network | AWS VPC |
|--------|---------------------|---------|
| **Infrastructure** | Physical hardware | Virtual (software-defined) |
| **Setup Time** | Weeks to months | Minutes |
| **Scaling** | Buy more hardware | Launch more instances |
| **Cost Model** | High upfront CapEx | Pay-as-you-go OpEx |
| **Redundancy** | Must build yourself | Built-in across AZs |
| **Security** | Physical + Network | Network + Identity + Encryption |
| **Maintenance** | You handle everything | AWS manages hardware |
| **Global Reach** | Build in each location | Deploy to 30+ regions |

---

## Security Layers in VPC

Your VPC has **multiple layers of security** (defense in depth):

```
Layer 1: Network ACLs (Subnet level)
  ↓ Stateless firewall
Layer 2: Security Groups (Instance level)
  ↓ Stateful firewall
Layer 3: IAM Roles (Identity & Permissions)
  ↓ Controls AWS API access
Layer 4: Application-Level Security
  ↓ Authentication, authorization, encryption
Layer 5: Data Encryption
  ↓ At-rest and in-transit
```

### Your Security Configuration

```
┌─────────────────────────────────────────────────────────┐
│ Layer 1: NETWORK ACL (Default - Allow All)             │
│   ✅ Inbound: Allow 0.0.0.0/0 all ports                │
│   ✅ Outbound: Allow 0.0.0.0/0 all ports               │
└─────────────────────────┬───────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 2: SECURITY GROUPS (Restrictive)                 │
│                                                          │
│   ALB Security Group (sg-0904b54e7b2350a76):           │
│   ✅ Inbound: Port 80 from 0.0.0.0/0 (internet)        │
│   ❌ All other ports: BLOCKED                          │
│                                                          │
│   EC2 Security Group (sg-057f6c376577d68fa):           │
│   ✅ Inbound: Port 80 from ALB SG only                 │
│   ✅ Inbound: Port 22 from 0.0.0.0/0 (SSH)             │
│   ❌ All other ports: BLOCKED                          │
└─────────────────────────┬───────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 3: IAM ROLES                                      │
│   EC2 Instance Role: aws-elasticbeanstalk-ec2-role     │
│   ✅ Can write to CloudWatch Logs                      │
│   ✅ Can read from S3 (application versions)           │
│   ❌ Cannot modify EC2 instances                       │
│   ❌ Cannot access other AWS services                  │
└─────────────────────────┬───────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Layer 4: APPLICATION SECURITY                           │
│   - Docker network isolation                            │
│   - Environment variables for secrets                   │
│   - PostgreSQL authentication                           │
└─────────────────────────────────────────────────────────┘
```

---

## Default VPC vs Custom VPC

### Your Default VPC (Current Setup)

```yaml
✅ Pros:
  - Pre-configured and ready to use
  - No setup required
  - Includes Internet Gateway, Route Tables, NACLs
  - Subnets in every Availability Zone
  - MapPublicIpOnLaunch enabled (easy internet access)
  - Perfect for dev/test/POC

❌ Cons:
  - Limited customization
  - All subnets are public (no private subnets)
  - Shared IP range (172.31.0.0/16) across all regions
  - Can't change CIDR block
  - Less control over network architecture
```

### Custom VPC (Production Best Practice)

```yaml
✅ Pros:
  - Complete control over CIDR blocks
  - Public AND private subnets
  - Custom route tables per subnet
  - VPC Peering, VPN, Direct Connect support
  - Better security isolation
  - Can design for compliance requirements

❌ Cons:
  - Requires networking knowledge
  - More complex setup
  - Must configure IGW, NAT Gateway, etc.
  - More components to manage
```

### When to Use Each

**Use Default VPC** (your current setup):
- POCs and demos ✅
- Development environments
- Learning AWS
- Quick experiments
- Simple applications

**Use Custom VPC**:
- Production applications
- Multi-tier architectures (web, app, database tiers)
- Hybrid cloud setups
- Compliance requirements (PCI-DSS, HIPAA)
- Large organizations with complex networking

---

## Real-World Analogies

### VPC = Apartment Building

```
VPC (172.31.0.0/16) = Your Apartment Building
├─ Internet Gateway = Main entrance/lobby
├─ Route Table = Building directory & signs
├─ Subnets = Different floors
│   ├─ Floor 2 (us-west-2a) = Public floor (street access)
│   ├─ Floor 3 (us-west-2b) = Public floor (street access) ← YOUR APARTMENT
│   ├─ Floor 4 (us-west-2c) = Public floor (street access)
│   └─ Floor 5 (us-west-2d) = Public floor (street access)
├─ Security Groups = Individual apartment locks
├─ Network ACLs = Floor security checkpoints
└─ EC2 Instances = Individual apartments

Internet User = Visitor
ALB = Building receptionist (directs visitors to apartments)
NAT Gateway = Package receiving room (for outbound deliveries)
```

### Traffic Flow = Mail Delivery

```
Inbound Mail (User Request):
1. Postman (Internet) delivers to building lobby (IGW)
2. Receptionist (ALB) checks directory (Route Table)
3. Security guard (NACL) checks floor access
4. Receptionist delivers to apartment door (EC2)
5. Apartment lock (Security Group) checks if sender is allowed
6. Resident (Docker Container) receives mail

Outbound Mail (API Call):
1. Resident (Container) sends letter
2. Apartment door (Security Group) allows outbound
3. Floor security (NACL) checks
4. Lobby (IGW) translates apartment number to building address (NAT)
5. Mail sent to external recipient (OpenAI)
```

---

## Advanced VPC Concepts

### 1. VPC Peering

**What it is**: Connect two VPCs to communicate privately.

```
Your VPC (172.31.0.0/16)
         ↕ VPC Peering Connection
Partner VPC (10.0.0.0/16)

Use case: Connect to another team's VPC without going through internet
```

### 2. VPC Endpoints

**What it is**: Private connection to AWS services without using Internet Gateway.

```
Your EC2 → VPC Endpoint → S3 (private connection)
vs
Your EC2 → Internet Gateway → S3 (public connection)

Benefits:
- Faster (stays within AWS network)
- More secure (no public exposure)
- Lower data transfer costs
```

### 3. NAT Gateway

**What it is**: Allows private subnet resources to access internet (outbound only).

```
Database in Private Subnet → NAT Gateway → Internet (for updates)
                              ↓
                         (inbound blocked)

Your setup: All subnets are public, so no NAT Gateway needed
```

### 4. VPN & Direct Connect

**VPN Connection**: Encrypted tunnel between your VPC and on-premises network

```
Your Office Network
    ↕ VPN Tunnel (encrypted)
Your VPC

Use case: Hybrid cloud, access on-prem databases from AWS
```

**Direct Connect**: Dedicated physical connection (faster, more expensive)

```
Your Data Center
    ↕ Dedicated Fiber Line (1 Gbps - 100 Gbps)
AWS Direct Connect Location
    ↕
Your VPC

Use case: Large data transfers, consistent low latency
```

### 5. Transit Gateway

**What it is**: Hub that connects multiple VPCs and on-premises networks.

```
        Transit Gateway (Hub)
              ↕
    ┌─────────┼─────────┐
    ↕         ↕         ↕
  VPC 1     VPC 2     VPC 3
    ↕
On-Premises Network

Use case: Large enterprises with 10+ VPCs
```

---

## VPC Limits & Best Practices

### AWS VPC Limits

| Resource | Default Limit | Can Request Increase? |
|----------|---------------|----------------------|
| VPCs per region | 5 | Yes |
| Subnets per VPC | 200 | Yes |
| CIDR blocks per VPC | 5 | Yes |
| Security Groups per VPC | 2,500 | Yes |
| Rules per Security Group | 60 | Yes |
| Network ACLs per VPC | 200 | Yes |
| Internet Gateways per region | 5 | No (1 per VPC anyway) |

### Best Practices

**1. CIDR Planning**
```
❌ Bad: Use /28 (16 IPs) - too small, will run out
✅ Good: Use /16-/20 range - room for growth

Plan for:
- Future subnets
- IP address growth
- Multi-region deployments
```

**2. Public vs Private Subnets**
```
✅ Production Best Practice:
  - Public Subnets: ALB, NAT Gateway, Bastion hosts only
  - Private Subnets: EC2 instances, databases, internal services
  - Benefits: Better security, reduced attack surface

⚠️ Your Current Setup (Dev/POC):
  - All public subnets (simpler, but less secure)
  - Acceptable for POC/development
```

**3. Multi-AZ Deployment**
```
✅ You're doing this right!
  - ALB deployed across 4 AZs
  - Auto Scaling Group spans 3 AZs
  - Benefits: High availability, fault tolerance
```

**4. Security Groups**
```
✅ Best Practices:
  - Principle of least privilege (only allow necessary ports)
  - Reference other security groups instead of IP ranges
  - Use descriptive names
  - Regular audits

✅ You're following this:
  - EC2 only accepts traffic from ALB SG (not 0.0.0.0/0)
  - ALB only allows port 80
```

**5. Monitoring**
```
✅ Enable:
  - VPC Flow Logs (track all network traffic)
  - CloudWatch metrics
  - AWS Config (track configuration changes)

⚠️ Your setup: Basic CloudWatch logging enabled
💡 Consider: Enable VPC Flow Logs for production
```

---

## Practical VPC Commands

### View Your VPC Details

```bash
# Describe your VPC
aws ec2 describe-vpcs --vpc-ids vpc-041cbc9a45cb2bcb8 --region us-west-2

# List all subnets in VPC
aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=vpc-041cbc9a45cb2bcb8" \
  --region us-west-2

# View route tables
aws ec2 describe-route-tables \
  --filters "Name=vpc-id,Values=vpc-041cbc9a45cb2bcb8" \
  --region us-west-2

# Check internet gateway
aws ec2 describe-internet-gateways \
  --filters "Name=attachment.vpc-id,Values=vpc-041cbc9a45cb2bcb8" \
  --region us-west-2

# View security groups
aws ec2 describe-security-groups \
  --filters "Name=vpc-id,Values=vpc-041cbc9a45cb2bcb8" \
  --region us-west-2

# View Network ACLs
aws ec2 describe-network-acls \
  --filters "Name=vpc-id,Values=vpc-041cbc9a45cb2bcb8" \
  --region us-west-2
```

### Test Connectivity

```bash
# SSH into your EC2 instance
eb ssh

# Check routes from inside EC2
ip route show

# Test internet connectivity
ping -c 4 8.8.8.8

# Check DNS resolution
nslookup api.openai.com

# View network interfaces
ip addr show

# Check which subnet you're in
curl http://169.254.169.254/latest/meta-data/subnet-id

# Check your private IP
curl http://169.254.169.254/latest/meta-data/local-ipv4

# Check your public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

---

## Summary

### What is VPC? (One-Sentence Answer)
**VPC is your isolated, private network in AWS cloud where you have complete control over IP addresses, subnets, routing, and security.**

### Key Takeaways

✅ **Your VPC** (`vpc-041cbc9a45cb2bcb8`):
- Default VPC with 65,536 IP addresses (172.31.0.0/16)
- 4 public subnets across 4 Availability Zones
- Internet Gateway for public internet access
- Route table directing traffic (local vs internet)
- Security groups protecting resources
- Hosts your entire Elastic Beanstalk infrastructure

✅ **Why VPC Matters**:
- **Isolation**: Your resources are separate from other AWS customers
- **Control**: You decide network architecture and security
- **Scalability**: Add subnets, instances as needed
- **Security**: Multiple firewall layers (NACLs, Security Groups)
- **Cost**: No additional charge for VPC itself

✅ **Your Setup is Production-Ready** because:
- Multi-AZ deployment (high availability) ✅
- Security groups properly configured ✅
- Internet connectivity working ✅
- Monitoring enabled (CloudWatch) ✅

✅ **Future Enhancements** (when scaling to production):
- Create custom VPC with private subnets
- Add NAT Gateway for private subnet internet access
- Enable VPC Flow Logs for network monitoring
- Add VPC Endpoints for S3/DynamoDB (cost savings)
- Enable EBS encryption and HTTPS

---

## Glossary

**VPC**: Virtual Private Cloud - Your isolated network in AWS

**CIDR**: Classless Inter-Domain Routing - IP address range notation (e.g., 172.31.0.0/16)

**Subnet**: Subdivision of VPC in a specific Availability Zone

**IGW**: Internet Gateway - Connection between VPC and internet

**Route Table**: Rules determining where network traffic goes

**NACL**: Network Access Control List - Subnet-level firewall

**Security Group**: Instance-level stateful firewall

**NAT**: Network Address Translation - Converts private ↔ public IPs

**AZ**: Availability Zone - Isolated data center within a region

**DHCP**: Dynamic Host Configuration Protocol - Automatic IP assignment

**ENI**: Elastic Network Interface - Virtual network card for EC2

---

Need more details on any specific VPC component? Let me know!
