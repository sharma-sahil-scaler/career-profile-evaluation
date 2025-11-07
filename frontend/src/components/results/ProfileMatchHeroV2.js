import React, { useState, useEffect, useRef, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import Xarrow from "react-xarrows";
import {
  CheckCircle,
  Clock,
  Star,
  ArrowsLeftRight,
  ArrowBendUpRight,
  Target,
  Lightbulb,
  Rocket,
  Books,
  ChartLine,
  Code,
  BriefcaseMetal,
  GraduationCap,
  Users,
  Trophy,
  Medal,
  Globe,
  Compass,
  Laptop,
  CloudArrowUp,
  Database,
  GitBranch,
  TestTube,
  FileMagnifyingGlass,
  UsersFour,
  MagnifyingGlass,
  Brain,
  Wrench,
  SparkleIcon as Sparkle,
  Buildings,
  CalendarBlank,
  MapPin,
  CheckSquare,
} from "phosphor-react";
import chatBot from "../../assets/ChatBot.png";
import oliveBranchLeft from "../../assets/Left-Olive-Branch.png";
import oliveBranchRight from "../../assets/Right-Olive-branch.png";
import PeerComparisonCard from "./PeerComparisonCard";
import { useRequestCallback } from "../../app/context/RequestCallbackContext";
import tracker from "../../utils/tracker";

const HeroContainer = styled.div`
  background: white;
  border-radius: 0;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
  min-height: auto;
  overflow: visible;

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    min-height: auto;
  }
`;

const LeftPanel = styled.div`
  background: ${(props) => (props.score >= 50 ? "#064e3b" : "#1f2937")};
  color: #ffffff;
  padding: ${(props) =>
    props.score >= 60 ? "48px 120px 48px 60px" : "48px 80px 48px 40px"};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 60px;
  position: relative;
  height: auto;
  overflow-y: visible;
  border-right: none;
  border-bottom: 2px solid
    ${(props) => (props.score >= 50 ? "#065f46" : "#374151")};

  @media (max-width: 1024px) {
    position: relative;
    height: auto;
    overflow-y: visible;
    border-right: none;
    flex-direction: column;
    padding: 32px 24px;
  }

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
    gap: 24px;
    align-items: stretch;
  }
`;

const HeroGreeting = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: #ffffff;
  white-space: pre-line;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    text-align: left;
  }
`;

const GreetingSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 16px;
`;

const GreetingSubtext = styled.div`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
  max-width: 550px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const RightPanel = styled.div`
  padding: 64px;
  overflow-y: visible;
  height: auto;

  @media (max-width: 1024px) {
    height: auto;
    overflow-y: visible;
    padding: 32px 24px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${(props) => (props.hasOliveBranches ? "24px 0" : "12px 0")};
  position: relative;
`;

const OliveBranch = styled.img`
  position: absolute;
  height: 100px;
  width: auto;
  opacity: 0.8;

  ${(props) =>
    props.position === "left"
      ? `
    left: -65px;
    top: 40%;
    transform: translateY(-50%);
  `
      : `
    right: -65px;
    top: 40%;
    transform: translateY(-50%);
  `}

  @media (max-width: 768px) {
    ${(props) =>
      props.position === "left"
        ? `
      left: 0;
    `
        : `
      right: 0;
    `}
  }
`;

const ScoreDisplay = styled.div`
  font-size: 4.625rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

const ScoreLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #cbd5e1;
`;

const PercentileText = styled.div`
  font-size: 1.0625rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
`;

const PeerText = styled.div`
  font-size: 0.9375rem;
  font-weight: 500;
  color: #cbd5e1;
  line-height: 1.5;
  text-align: left;
  padding: 0 8px;
`;

const SectionTitle = styled.h4`
  font-size: 0.8125rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.75px;
`;

const Divider = styled.div`
  height: 1px;
  background: #334155;
  margin: 20px 0;
  opacity: 0.5;
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.div`
  background: ${(props) => {
    if (props.variant === "strength") return "rgba(16, 185, 129, 0.2)";
    if (props.variant === "improve") return "rgba(148, 163, 184, 0.15)";
    return "rgba(251, 146, 60, 0.15)";
  }};
  border: 1.5px solid
    ${(props) => {
      if (props.variant === "strength") return "#10b981";
      if (props.variant === "improve") return "#94a3b8";
      return "#fb923c";
    }};
  color: ${(props) => {
    if (props.variant === "strength") return "#ffffff";
    if (props.variant === "improve") return "#475569";
    return "#9a3412";
  }};
  padding: 6px 12px;
  border-radius: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const ChatBubbleWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 64px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const ChatSection = styled.div`
  background: #fefce8;
  border: 2px solid #fde047;
  border-radius: 0;
  padding: 16px 20px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex: 1;

  &::before {
    content: "";
    position: absolute;
    left: -14px;
    top: 20px;
    width: 0;
    height: 0;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-right: 14px solid #fde047;

    @media (max-width: 768px) {
      left: 24px;
      top: -14px;
      border-left: 12px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 14px solid #fde047;
      border-top: 0;
    }
  }

  &::after {
    content: "";
    position: absolute;
    left: -10px;
    top: 20px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 12px solid #fefce8;

    @media (max-width: 768px) {
      left: 26px;
      top: -10px;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 12px solid #fefce8;
      border-top: 0;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const BotAvatar = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
`;

const BotImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const ChatText = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 16px 0;
  font-weight: 600;
  color: #1e293b;
`;

const AttributesContainer = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #fde68a;
`;

const AttributesLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #854d0e;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AttributesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const AttributeBadge = styled.div`
  background: #fef3c7;
  border: 1px solid #fde047;
  color: #78350f;
  padding: 6px 12px;
  border-radius: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const SectionBlock = styled.div`
  margin-bottom: 64px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const SectionHeading = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.4;
`;

const SectionDivider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin-bottom: 20px;
`;

const QuickWinsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const QuickWinItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
  padding: 0;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  transition: all 0.2s ease;
  position: relative;
`;

const QuickWinIcon = styled.div`
  width: 72px;
  height: 72px;
  background: ${(props) => {
    const gradients = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    ];
    return gradients[props.index % 4];
  }};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
  position: relative;
`;

const QuickWinNumber = styled.div`
  background: #f1f5f9;
  color: #1e293b;
  width: 64px;
  height: 64px;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
  border: 2px solid #e2e8f0;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    width: 104px;
    height: 2px;
    background: #e2e8f0;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const QuickWinSpacer = styled.div`
  width: 104px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const QuickWinCard = styled.div`
  flex: 1;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0;
  padding: 16px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const QuickWinIconContainer = styled.div`
  width: 48px;
  height: 48px;
  background: ${(props) => props.iconColor || "#e8eaf6"};
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-bottom: 16px;

  svg {
    color: white;
  }
`;

const QuickWinContent = styled.div`
  flex: 1;
  width: 100%;
`;

const QuickWinTitle = styled.div`
  font-size: 1.0625rem;
  color: #1e293b;
  font-weight: 700;
  margin-bottom: 8px;
  line-height: 1.3;
`;

const QuickWinDescription = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
`;

const EmptySection = styled.div`
  padding: 32px 24px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 0;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  font-style: italic;
`;

const PageTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
`;

const CareerTransitionContainer = styled.div`
  margin-bottom: 36px;
`;

const CareerTransitionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
`;

const CareerTransitionSubtitle = styled.p`
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0 0 20px 0;
`;

const PathContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 60px;
  margin-bottom: 24px;
  position: relative;
  max-width: 100%;
  overflow: visible;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileRolesContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
`;

const MobileRoleCategory = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(props) => {
    if (props.type === "target") return "#059669";
    if (props.type === "alternate") return "#64748b";
    return "#64748b";
  }};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;

  &:nth-child(2) {
    align-items: center;
    justify-content: flex-start;
  }
`;

const CurrentRoleCard = styled.div`
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CurrentRoleInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CurrentRoleTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
`;

const CurrentBadge = styled.div`
  display: inline-block;
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 0;
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
  align-self: flex-start;
`;

const CurrentRoleDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #475569;
  margin-bottom: 8px;

  svg {
    color: #64748b;
    flex-shrink: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryCard = styled.div`
  background: white;
  border: 1px solid
    ${(props) => {
      if (props.type === "target") return "#86efac";
      if (props.type === "alternate") return "#cbd5e1";
      return "#cbd5e1";
    }};
  border-radius: 0;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  color: #334155;
  font-size: 0.8125rem;
  font-weight: 600;
  position: relative;
  z-index: 10;
  width: 180px;

  svg {
    color: ${(props) => {
      if (props.type === "target") return "#059669";
      if (props.type === "alternate") return "#64748b";
      return "#64748b";
    }};
  }
`;

const CategoryLabel = styled.div`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(props) => {
    if (props.type === "target") return "#059669";
    if (props.type === "alternate") return "#64748b";
    return "#64748b";
  }};
  text-align: left;
  width: 100%;
`;

const CategoryTimeline = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  width: 100%;
`;

const RoleCard = styled.div`
  background: ${(props) =>
    props.isPriority
      ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
      : "#ffffff"};
  border: 1px solid ${(props) => (props.isPriority ? "#86efac" : "#e2e8f0")};
  border-radius: 0;
  padding: 16px;
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 10;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const RoleContent = styled.div`
  flex: 1;
`;

const RoleHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

const RoleTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  flex: 1;
  line-height: 1.3;
`;

const RoleDescription = styled.p`
  font-size: 0.8125rem;
  color: #475569;
  line-height: 1.5;
  margin: 8px 0 0 0;

  strong {
    color: #1e293b;
    font-weight: 600;
  }
`;

const RoleFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const Salary = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: 1px solid #059669;
  padding: 4px 10px;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: #059669;
  white-space: nowrap;
`;

const MatchBadge = styled.div`
  background: ${(props) => {
    if (props.match >= 80) return "#dcfce7";
    if (props.match >= 60) return "#fef3c7";
    return "#f1f5f9";
  }};
  color: ${(props) => {
    if (props.match >= 80) return "#15803d";
    if (props.match >= 60) return "#a16207";
    return "#475569";
  }};
  padding: 3px 8px;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

const BenchmarkContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BenchmarkLeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BenchmarkItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 0;
  border: 1px solid #e2e8f0;
`;

const BenchmarkLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const BenchmarkValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
`;

const GapAnalysis = styled.div`
  background: #f8fafc;
  border-radius: 0;
  padding: 16px;
  font-size: 0.875rem;
  color: #334155;
  line-height: 1.5;
  border: 1px solid #e2e8f0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ToolsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Tool = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 0;
  padding: 12px 16px;
`;

const ToolLogo = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
`;

const ToolLogoPlaceholder = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  flex-shrink: 0;
`;

const ToolName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
`;

const CTASection = styled.div`
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 0;
  padding: 24px 28px;
  margin: 48px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    margin: 40px 0;
    padding: 16px;
  }
`;

const CTAContent = styled.div`
  flex: 1;
`;

const CTATitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
`;

const CTAText = styled.p`
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0;
`;

const CTAButton = styled.button`
  background: #c71f69;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #a01855;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 20px;
  }
`;

const TwoColumnTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TableColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TableColumnTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(props) => (props.type === "strength" ? "#059669" : "#dc2626")};
  margin-bottom: 8px;
`;

const TableItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: ${(props) => (props.type === "strength" ? "#f0fdf4" : "#fef2f2")};
  border: 1px solid
    ${(props) => (props.type === "strength" ? "#bbf7d0" : "#fecaca")};
  border-radius: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => (props.type === "strength" ? "#166534" : "#991b1b")};

  svg {
    flex-shrink: 0;
  }
`;

// Helper functions for career transition
const categorizeRoles = (roles) => {
  // Remove duplicates based on title
  const uniqueRoles = [];
  const seenTitles = new Set();

  roles.forEach((role) => {
    const title = (role.title || role.role || "").toLowerCase().trim();
    if (title && !seenTitles.has(title)) {
      seenTitles.add(title);
      uniqueRoles.push(role);
    }
  });

  // Sort by match score
  const sorted = [...uniqueRoles].sort(
    (a, b) => (b.match_score || 0) - (a.match_score || 0)
  );

  const categories = {
    mostLikely: [],
    similar: [],
    pivot: [],
  };

  // Take top 3 unique roles
  const rolesToShow = sorted.slice(0, 3);

  if (rolesToShow.length === 0) {
    return categories;
  }

  // Simple distribution: First role → Most Likely, Second → Similar, Third → Pivot
  rolesToShow.forEach((role, index) => {
    const match = role.match_score || 0;

    if (index === 0) {
      // First role always goes to Most Likely with at least 75% match
      categories.mostLikely.push({
        ...role,
        match_score: Math.max(match, 75),
      });
    } else if (index === 1) {
      // Second role goes to Similar with at least 60% match
      categories.similar.push({
        ...role,
        match_score: Math.max(match, 60),
      });
    } else if (index === 2) {
      // Third role goes to Pivot with at least 55% match
      categories.pivot.push({
        ...role,
        match_score: Math.max(match, 55),
      });
    }
  });

  return categories;
};

const formatSalary = (salary) => {
  if (!salary) return null;

  // Convert to string and clean up
  const salaryStr = salary.toString().trim();

  // If already in LPA format, return as is
  if (
    salaryStr.toLowerCase().includes("lpa") ||
    salaryStr.toLowerCase().includes("l pa")
  ) {
    return salaryStr.replace(/\s+/g, "").toUpperCase();
  }

  // Extract numbers from salary range (e.g., "$80k-$100k" or "80-100k")
  const numbers = salaryStr.match(/\d+/g);
  if (numbers && numbers.length >= 2) {
    return `${numbers[0]}L-${numbers[1]}LPA`;
  } else if (numbers && numbers.length === 1) {
    return `${numbers[0]}LPA`;
  }

  return salaryStr;
};

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const calculateAlternateTimeline = (baseTimeline, addMonths) => {
  // Parse timeline like "4-6 months" or "3-5 months"
  const match = baseTimeline.match(/(\d+)-(\d+)/);
  if (match) {
    const min = parseInt(match[1]) + addMonths;
    const max = parseInt(match[2]) + addMonths;
    return `${min}-${max} months`;
  }
  return baseTimeline;
};

// Helper function to get tool logo URLs
const getToolLogoUrl = (toolName) => {
  const tool = toolName.toLowerCase();

  // Extract first word for better matching (e.g., "Excalidraw or Draw.io" → "excalidraw")
  const firstWord = tool.split(/[\s\-/,]+/)[0];

  // Map common tools to their logo domains
  const logoMap = {
    react:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    node: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    nodejs:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    python:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    javascript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    typescript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    docker:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    kubernetes:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    aws: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    mongodb:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    postgresql:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    mysql:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    redis:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    github:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    spring:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
    angular:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    vue: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    graphql:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    firebase:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    leetcode:
      "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
    excalidraw: "https://excalidraw.com/apple-touch-icon.png",
    "draw.io": "https://app.diagrams.net/images/drawlogo.svg",
    miro: "https://cdn.brandfetch.io/miro.com/w/400/h/400",
    terraform:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
    pulumi: "https://www.pulumi.com/logos/brand/avatar-on-white.svg",
    prometheus:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg",
    grafana:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg",
    argocd:
      "https://cncf-branding.netlify.app/img/projects/argo/icon/color/argo-icon-color.svg",
    datadog:
      "https://imgix.datadoghq.com/img/about/presskit/logo-v/dd_vertical_purple.png",
    vault:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vault/vault-original.svg",
    pagerduty: "https://cdn.brandfetch.io/pagerduty.com/w/400/h/400",
    sentry: "https://cdn.brandfetch.io/sentry.io/w/400/h/400",
    postman: "https://cdn.brandfetch.io/postman.com/w/400/h/400",
    replit: "https://cdn.brandfetch.io/replit.com/w/400/h/400",
    dbeaver: "https://cdn.brandfetch.io/dbeaver.io/w/400/h/400",
    tableplus: "https://cdn.brandfetch.io/tableplus.com/w/400/h/400",
  };

  // First try exact match with first word
  if (logoMap[firstWord]) {
    return logoMap[firstWord];
  }

  // Then try full tool name match
  if (logoMap[tool]) {
    return logoMap[tool];
  }

  // Check for partial match
  for (const [key, url] of Object.entries(logoMap)) {
    if (
      tool.includes(key) ||
      key.includes(tool) ||
      firstWord.includes(key) ||
      key.includes(firstWord)
    ) {
      return url;
    }
  }

  return null;
};

// Tool item component to handle logo state
const ToolItem = ({ toolName }) => {
  const logoUrl = getToolLogoUrl(toolName);
  const initial = toolName.charAt(0).toUpperCase();
  const [showLogo, setShowLogo] = useState(!!logoUrl);

  return (
    <Tool>
      {logoUrl && showLogo ? (
        <ToolLogo
          src={logoUrl}
          alt={toolName}
          onError={() => setShowLogo(false)}
        />
      ) : (
        <ToolLogoPlaceholder>{initial}</ToolLogoPlaceholder>
      )}
      <ToolName>{toolName}</ToolName>
    </Tool>
  );
};

const ProfileMatchHeroV2 = ({
  score,
  notes,
  badges,
  evaluationResults,
  background: backgroundProp,
  quizResponses,
  goals,
  userName = "There",
}) => {
  const { open: openCallbackModal } = useRequestCallback();
  const [displayScore, setDisplayScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const heroRef = useRef(null);

  const animateScore = useCallback(() => {
    if (!score || score === 0) {
      return;
    }

    const duration = 2000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);
  }, [score]);

  // Animate score when it changes or component mounts
  useEffect(() => {
    if (score && score > 0 && !hasAnimated) {
      setHasAnimated(true);
      animateScore();
    }
  }, [score, hasAnimated, animateScore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated && score > 0) {
            setHasAnimated(true);
            animateScore();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    // Force re-render arrows for career transition
    const timer = setTimeout(() => {
      setShowArrows(true);
    }, 100);

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
      clearTimeout(timer);
    };
  }, [hasAnimated, score, animateScore]);

  const strengths = evaluationResults?.skill_analysis?.strengths || [];
  const areasToImprove =
    evaluationResults?.skill_analysis?.areas_to_develop || [];
  const quickWins = evaluationResults?.quick_wins || [];
  const tools = evaluationResults?.recommended_tools || [];
  const peerComparison = evaluationResults?.peer_comparison || {};
  const experienceBenchmark = evaluationResults?.experience_benchmark || null;
  const recommendedRoles =
    evaluationResults?.recommended_roles_based_on_interests || [];
  const experienceYears = quizResponses?.experience || "Not specified";

  const background = backgroundProp || "tech";

  const currentRoleRaw =
    quizResponses?.currentRole ||
    quizResponses?.currentBackground ||
    "Current Role";

  const getCompanyType = (roleValue) => {
    if (!roleValue) return "Not specified";

    const roleMap = {
      "swe-product": "Product Company",
      "swe-service": "Service Company",
      devops: "Tech Company",
      "qa-support": "Tech Company",
    };

    return roleMap[roleValue] || "Tech Company";
  };

  // Extract clean role name without company type
  const getRoleName = (roleValue, backgroundValue) => {
    if (!roleValue) return "Current Role";

    if (backgroundValue === "tech") {
      const roleNameMap = {
        "swe-product": "Software Engineer",
        "swe-service": "Software Engineer",
        devops: "DevOps Engineer",
        "qa-support": "QA / Support Engineer",
      };
      return roleNameMap[roleValue] || roleValue;
    }

    // Non-tech backgrounds
    const nonTechMap = {
      "sales-marketing": "Sales / Marketing",
      operations: "Operations / Consulting",
      design: "Designer",
      finance: "Finance Professional",
      other: "Professional",
    };
    return nonTechMap[roleValue] || roleValue;
  };

  const currentRole = getRoleName(currentRoleRaw, background);
  const currentCompanyType =
    background === "tech"
      ? getCompanyType(currentRoleRaw)
      : "Non-Tech Background";

  const getGreetingText = (score) => {
    if (score >= 80) return "Your Profile is Exceptional";
    if (score >= 65) return "Your Profile Looks Strong";
    if (score >= 50) return "Your Profile Looks Promising";
    if (score >= 35) return "Your Profile Has Potential";
    return "Your Profile Needs Work";
  };

  // Generate personalized, conversational summary
  const getPersonalizedSummary = () => {
    const experience = quizResponses?.experience || "";
    const currentRole = quizResponses?.currentRole || "";
    const targetRole = quizResponses?.targetRole || "";
    const targetCompany =
      goals?.targetCompany || quizResponses?.targetCompanyLabel || "";
    const problemSolving = quizResponses?.problemSolving || "";
    const systemDesign = quizResponses?.systemDesign || "";
    const portfolio = quizResponses?.portfolio || "";

    const getRoleFriendlyName = (role) => {
      const roleMap = {
        "swe-product": "product companies",
        "swe-service": "service companies",
        devops: "DevOps",
        "qa-support": "QA/Support",
      };
      return roleMap[role] || role;
    };

    const getTargetRoleName = (role) => {
      const roleMap = {
        "faang-sde": "FAANG-level companies",
        "startup-sde": "high-growth startups",
        "backend-dev": "backend development roles",
        "fullstack-dev": "full-stack development roles",
        "devops-eng": "DevOps engineering roles",
        "ml-engineer": "ML engineering roles",
      };
      return roleMap[role] || role;
    };

    const currentCompanyType = getRoleFriendlyName(currentRole);
    const targetRoleName = getTargetRoleName(targetRole);

    // Build conversational message
    const greeting =
      "Congratulations on taking the first step to evaluate your profile.\n\n";

    let profileAnalysis = "";
    if (experience && currentRole) {
      profileAnalysis = `Looking at your profile, I can see you have ${experience} of experience at ${currentCompanyType}. `;

      // Add validation based on experience
      if (experience === "0-2") {
        profileAnalysis += "That's a great foundation to build upon! ";
      } else if (experience === "3-5") {
        profileAnalysis += "That's solid experience that positions you well! ";
      } else if (experience === "5-8" || experience === "8+") {
        profileAnalysis +=
          "That's substantial experience that gives you a strong edge! ";
      }
    }

    let goalStatement = "";
    if (targetRole || targetCompany) {
      const goalTarget = targetCompany || targetRoleName;
      goalStatement = `You've expressed interest in moving to ${goalTarget}—and I have good news: that goal is absolutely reachable! 🎯\n\n`;
    }

    // Extract quick wins or key actions from backend notes
    let keyActions =
      "Here are the 3 most impactful things you should focus on:\n";

    if (problemSolving === "0-10" || problemSolving === "11-50") {
      keyActions +=
        "1. Strengthen your problem-solving skills (aim for 100+ problems)\n";
    } else {
      keyActions +=
        "1. Master advanced problem-solving patterns and practice consistently\n";
    }

    if (systemDesign === "never-done" || systemDesign === "participated") {
      keyActions +=
        "2. Lead system design discussions and study real-world architectures\n";
    } else {
      keyActions +=
        "2. Deepen your system design expertise with scalability patterns\n";
    }

    if (portfolio === "none" || portfolio === "1-2") {
      keyActions +=
        "3. Build an active portfolio with meaningful projects on GitHub\n";
    } else {
      keyActions +=
        "3. Showcase your technical depth through blogs or contributions\n";
    }

    keyActions +=
      "\nThe rest of the detailed insights are in your report below. Let's get you interview-ready! 🚀";

    return greeting + profileAnalysis + goalStatement + keyActions;
  };

  const handleRCBClick = useCallback(() => {
    tracker.click({
      click_type: "rcb_btn_clicked",
      custom: {
        source: "profile_match_hero_v2",
      },
    });
    openCallbackModal?.();
  }, []);

  return (
    <HeroContainer ref={heroRef}>
      <LeftPanel score={score}>
        <GreetingSection>
          <HeroGreeting>
            Hey {userName},{"\n"}
            {getGreetingText(score)}
          </HeroGreeting>
          <GreetingSubtext>
            Your path to 100% career readiness starts here.
          </GreetingSubtext>
        </GreetingSection>
        <ScoreSection hasOliveBranches={score >= 60}>
          {score >= 60 && (
            <OliveBranch src={oliveBranchLeft} alt="" position="left" />
          )}
          {score >= 60 && (
            <OliveBranch src={oliveBranchRight} alt="" position="right" />
          )}
          <ScoreDisplay>{displayScore}%</ScoreDisplay>
          <ScoreLabel>Career Readiness Score</ScoreLabel>
        </ScoreSection>
      </LeftPanel>

      <RightPanel>
        <ChatBubbleWrapper>
          <BotAvatar>
            <BotImage src={chatBot} alt="Scaler Bot" />
          </BotAvatar>
          <ChatSection>
            <ChatText style={{ whiteSpace: "pre-line" }}>
              {getPersonalizedSummary()}
            </ChatText>
            {badges && badges.length > 0 && (
              <AttributesContainer>
                <AttributesLabel>Your Attributes:</AttributesLabel>
                <AttributesList>
                  {badges.map((badge, index) => (
                    <AttributeBadge key={index}>
                      {typeof badge === "string" ? badge : badge.name}
                    </AttributeBadge>
                  ))}
                </AttributesList>
              </AttributesContainer>
            )}
          </ChatSection>
        </ChatBubbleWrapper>

        {/* Skills Section - Moved to top for both modes */}
        {(strengths.length > 0 || areasToImprove.length > 0) && (
          <SectionBlock className="gtm-section-view" data-gtm-section-name="See Where You Stand Today">
            <SectionHeading>See Where You Stand Today</SectionHeading>
            <SectionSubtitle>
              Compare your strengths and areas for improvement
            </SectionSubtitle>
            <SectionDivider />
            <TwoColumnTable>
              <TableColumn>
                <TableColumnTitle type="strength">
                  Your Strengths
                </TableColumnTitle>
                {strengths.length > 0 ? (
                  strengths.map((strength, index) => (
                    <TableItem key={index} type="strength">
                      <CheckCircle size={18} weight="fill" color="#059669" />
                      {strength}
                    </TableItem>
                  ))
                ) : (
                  <EmptySection>No strengths identified yet.</EmptySection>
                )}
              </TableColumn>
              <TableColumn>
                <TableColumnTitle type="improve">
                  Areas to Improve
                </TableColumnTitle>
                {areasToImprove.length > 0 ? (
                  areasToImprove.map((area, index) => (
                    <TableItem key={index} type="improve">
                      <Target size={18} weight="fill" color="#dc2626" />
                      {area}
                    </TableItem>
                  ))
                ) : (
                  <EmptySection>No gaps identified yet.</EmptySection>
                )}
              </TableColumn>
            </TwoColumnTable>
          </SectionBlock>
        )}

        {/* Section Order: Career Transition → Quick Wins → Tools → Experience → Peer Comparison */}

        <>
          {/* Career Transition Section - Shows realistic timelines to achieve target role */}
          {recommendedRoles.length > 0 && (
            <CareerTransitionContainer className="gtm-section-view" data-gtm-section-name="Career Timeline">
              <CareerTransitionTitle>Career Timeline</CareerTransitionTitle>
              <CareerTransitionSubtitle>
                Realistic timelines to achieve your target roles based on
                current skill gaps
              </CareerTransitionSubtitle>
              <SectionDivider />
              <PathContainer>
                {/* Column 1: Current Role */}
                <Column>
                  <CurrentRoleCard id="current-role">
                    <CurrentBadge>You are here</CurrentBadge>
                    <CurrentRoleInfo>
                      <CurrentRoleTitle>{currentRole}</CurrentRoleTitle>
                      <CurrentRoleDetail>
                        <Buildings size={18} weight="regular" />
                        <span>{currentCompanyType}</span>
                      </CurrentRoleDetail>
                      <CurrentRoleDetail>
                        <CalendarBlank size={18} weight="regular" />
                        <span>{experienceYears} years of experience</span>
                      </CurrentRoleDetail>
                    </CurrentRoleInfo>
                  </CurrentRoleCard>
                </Column>

                {/* Column 2: Timeline Cards */}
                <Column>
                  {recommendedRoles.slice(0, 3).map((role, index) => {
                    const baseTimeline =
                      role.timeline_text ||
                      `${role.min_months || 4}-${role.max_months || 6} months`;
                    let displayTimeline = baseTimeline;
                    let cardType = "target";
                    let label = "Target Role";

                    if (index === 1) {
                      displayTimeline = calculateAlternateTimeline(
                        baseTimeline,
                        1
                      );
                      cardType = "alternate";
                      label = "Alternate Path 1";
                    } else if (index === 2) {
                      displayTimeline = calculateAlternateTimeline(
                        baseTimeline,
                        2
                      );
                      cardType = "alternate";
                      label = "Alternate Path 2";
                    } else {
                      label = "Your Target Role";
                    }

                    return (
                      <CategoryCard
                        key={index}
                        type={cardType}
                        id={`timeline-${index}`}
                      >
                        <CategoryLabel type={cardType}>{label}</CategoryLabel>
                        <CategoryTimeline>
                          <Clock size={16} weight="bold" />
                          {displayTimeline}
                        </CategoryTimeline>
                      </CategoryCard>
                    );
                  })}
                </Column>

                <Column>
                  {recommendedRoles.slice(0, 3).map((role, index) => {
                    const isPrimary = index === 0;
                    const formattedSalary = formatSalary(role.salary_range_usd);

                    const targetCompanyLabel =
                      quizResponses?.targetCompanyLabel ||
                      goals?.targetCompany ||
                      "";
                    const roleTitle = role.title || role.role;
                    const displayTitle = targetCompanyLabel
                      ? `${roleTitle} - ${targetCompanyLabel}`
                      : roleTitle;

                    return (
                      <RoleCard
                        key={index}
                        id={`role-${index}`}
                        isPriority={isPrimary}
                      >
                        {formattedSalary && <Salary>{formattedSalary}</Salary>}
                        <RoleContent>
                          <RoleHeader>
                            <RoleTitle>{displayTitle}</RoleTitle>
                          </RoleHeader>
                          {role.key_gap && (
                            <RoleDescription
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                              }}
                            >
                              <MapPin
                                size={16}
                                weight="regular"
                                color="#64748b"
                                style={{
                                  marginRight: "6px",
                                  marginTop: "2px",
                                  flexShrink: 0,
                                }}
                              />
                              <span>
                                <strong>Key Focus:</strong> {role.key_gap}
                              </span>
                            </RoleDescription>
                          )}
                          {role.milestones && role.milestones.length > 0 && (
                            <>
                              {role.milestones.map((milestone, mIndex) => (
                                <RoleDescription
                                  key={mIndex}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <CheckSquare
                                    size={16}
                                    weight="regular"
                                    color="#64748b"
                                    style={{
                                      marginRight: "6px",
                                      marginTop: "2px",
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span>
                                    <strong>Milestone {mIndex + 1}:</strong>{" "}
                                    {milestone}
                                  </span>
                                </RoleDescription>
                              ))}
                            </>
                          )}
                        </RoleContent>
                      </RoleCard>
                    );
                  })}
                </Column>

                {showArrows && (
                  <>
                    {recommendedRoles.slice(0, 3).map((_, index) => (
                      <React.Fragment key={`arrows-${index}`}>
                        <Xarrow
                          start="current-role"
                          end={`timeline-${index}`}
                          color={
                            index === 0
                              ? "#a7f3d0"
                              : index === 1
                              ? "#bfdbfe"
                              : "#e9d5ff"
                          }
                          strokeWidth={6}
                          curveness={0.8}
                          headSize={0}
                          path="smooth"
                          zIndex={1}
                        />
                        <Xarrow
                          start={`timeline-${index}`}
                          end={`role-${index}`}
                          color={
                            index === 0
                              ? "#a7f3d0"
                              : index === 1
                              ? "#bfdbfe"
                              : "#e9d5ff"
                          }
                          strokeWidth={6}
                          curveness={0.6}
                          startAnchor="right"
                          endAnchor="left"
                          headSize={0}
                          path="smooth"
                          zIndex={1}
                        />
                      </React.Fragment>
                    ))}
                  </>
                )}
              </PathContainer>

              <MobileRolesContainer>
                {recommendedRoles.slice(0, 3).map((role, index) => {
                  const isPrimary = index === 0;
                  const baseTimeline =
                    role.timeline_text ||
                    `${role.min_months || 4}-${role.max_months || 6} months`;
                  let displayTimeline = baseTimeline;
                  let categoryType = "target";
                  let label = "Target Role";

                  if (index === 1) {
                    displayTimeline = calculateAlternateTimeline(
                      baseTimeline,
                      1
                    );
                    categoryType = "alternate";
                    label = "Alternate Path 1";
                  } else if (index === 2) {
                    displayTimeline = calculateAlternateTimeline(
                      baseTimeline,
                      2
                    );
                    categoryType = "alternate";
                    label = "Alternate Path 2";
                  } else {
                    label = "Your Target Role";
                  }

                  const formattedSalary = formatSalary(role.salary_range_usd);

                  // Add target company to ALL role titles (not just first)
                  // Use targetCompanyLabel from quizResponses for display (e.g., "FAANG / Big Tech")
                  const targetCompanyLabel =
                    quizResponses?.targetCompanyLabel ||
                    goals?.targetCompany ||
                    "";
                  const roleTitle = role.title || role.role;
                  const displayTitle = targetCompanyLabel
                    ? `${roleTitle} - ${targetCompanyLabel}`
                    : roleTitle;

                  return (
                    <div key={index}>
                      <MobileRoleCategory type={categoryType}>
                        <Clock size={14} weight="bold" />
                        {label}: {displayTimeline}
                      </MobileRoleCategory>
                      <RoleCard isPriority={isPrimary}>
                        {formattedSalary && <Salary>{formattedSalary}</Salary>}
                        <RoleContent>
                          <RoleHeader>
                            <RoleTitle>{displayTitle}</RoleTitle>
                          </RoleHeader>
                          {role.key_gap && (
                            <RoleDescription
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                              }}
                            >
                              <MapPin
                                size={16}
                                weight="regular"
                                color="#64748b"
                                style={{
                                  marginRight: "6px",
                                  marginTop: "2px",
                                  flexShrink: 0,
                                }}
                              />
                              <span>
                                <strong>Key Focus:</strong> {role.key_gap}
                              </span>
                            </RoleDescription>
                          )}
                          {role.milestones && role.milestones.length > 0 && (
                            <>
                              {role.milestones.map((milestone, mIndex) => (
                                <RoleDescription
                                  key={mIndex}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <CheckSquare
                                    size={16}
                                    weight="regular"
                                    color="#64748b"
                                    style={{
                                      marginRight: "6px",
                                      marginTop: "2px",
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span>
                                    <strong>Milestone {mIndex + 1}:</strong>{" "}
                                    {milestone}
                                  </span>
                                </RoleDescription>
                              ))}
                            </>
                          )}
                        </RoleContent>
                      </RoleCard>
                    </div>
                  );
                })}
              </MobileRolesContainer>
            </CareerTransitionContainer>
          )}

          {recommendedRoles.length > 0 && (
            <CTASection>
              <CTAContent>
                <CTATitle>Ready to Deep Dive In?</CTATitle>
                <CTAText>
                  Get a custom roadmap generated based on your current profile,
                  detailing exactly what you need to do to achieve your goal and
                  land your target role.
                </CTAText>
              </CTAContent>
              <CTAButton
                onClick={() => window.open("/career-consultation", "_blank")}
              >
                Book Career Consultation
              </CTAButton>
            </CTASection>
          )}

          {quickWins.length > 0 && (
            <SectionBlock className="gtm-section-view" data-gtm-section-name="Quick Wins for You">
              <SectionHeading>Quick Wins for You</SectionHeading>
              <SectionSubtitle>
                Take these actionable steps to improve your profile
              </SectionSubtitle>
              <SectionDivider />
              <QuickWinsList>
                {quickWins.slice(0, 4).map((win, index) => {
                  const iconColors = [
                    "#D90065",
                    "#D77C00",
                    "#C32841",
                    "#1D925B",
                    "#0052FF",
                    "#016DD9",
                  ];
                  const iconColor = iconColors[index % iconColors.length];

                  const iconMap = {
                    lightbulb: <Lightbulb size={24} weight="fill" />,
                    rocket: <Rocket size={24} weight="fill" />,
                    books: <Books size={24} weight="fill" />,
                    chart: <ChartLine size={24} weight="fill" />,
                    code: <Code size={24} weight="fill" />,
                    briefcase: <BriefcaseMetal size={24} weight="fill" />,
                    graduation: <GraduationCap size={24} weight="fill" />,
                    users: <Users size={24} weight="fill" />,
                    trophy: <Trophy size={24} weight="fill" />,
                    target: <Target size={24} weight="fill" />,
                    certificate: <Medal size={24} weight="fill" />,
                  };

                  const iconName =
                    typeof win === "object" && win.icon
                      ? win.icon.toLowerCase()
                      : "lightbulb";
                  const IconComponent =
                    iconMap[iconName] || iconMap["lightbulb"];

                  return (
                    <QuickWinItem key={index}>
                      <QuickWinNumber>{index + 1}</QuickWinNumber>
                      <QuickWinSpacer />
                      <QuickWinCard>
                        <QuickWinIconContainer iconColor={iconColor}>
                          {IconComponent}
                        </QuickWinIconContainer>
                        <QuickWinContent>
                          {typeof win === "string" ? (
                            <QuickWinDescription>{win}</QuickWinDescription>
                          ) : (
                            <>
                              <QuickWinTitle>
                                {win.name || win.title}
                              </QuickWinTitle>
                              {win.description && (
                                <QuickWinDescription>
                                  {win.description}
                                </QuickWinDescription>
                              )}
                            </>
                          )}
                        </QuickWinContent>
                      </QuickWinCard>
                    </QuickWinItem>
                  );
                })}
              </QuickWinsList>
            </SectionBlock>
          )}

          {tools.length > 0 && (
            <SectionBlock className="gtm-section-view" data-gtm-section-name="Tools & Technologies to Learn">
              <SectionHeading>Tools & Technologies to Learn</SectionHeading>
              <SectionSubtitle>
                Master these tools to enhance your skillset
              </SectionSubtitle>
              <SectionDivider />
              <ToolsGrid>
                {tools.slice(0, 8).map((tool, index) => {
                  const toolName = typeof tool === "string" ? tool : tool.name;
                  return <ToolItem key={index} toolName={toolName} />;
                })}
              </ToolsGrid>
            </SectionBlock>
          )}

          {experienceBenchmark && (
            <SectionBlock className="gtm-section-view" data-gtm-section-name="Experience Benchmark">
              <SectionHeading>Experience Benchmark</SectionHeading>
              <SectionSubtitle>
                Compare your experience with typical requirements for your
                target role
              </SectionSubtitle>
              <SectionDivider />
              <BenchmarkContainer>
                <BenchmarkLeftSection>
                  <BenchmarkItem>
                    <BenchmarkLabel>Your Experience</BenchmarkLabel>
                    <BenchmarkValue>
                      {experienceBenchmark.your_experience_years}
                      {!experienceBenchmark.your_experience_years
                        ?.toLowerCase()
                        .includes("year") && " years"}
                    </BenchmarkValue>
                  </BenchmarkItem>
                  <BenchmarkItem>
                    <BenchmarkLabel>Typical for Target Role</BenchmarkLabel>
                    <BenchmarkValue>
                      {experienceBenchmark.typical_for_target_role_years}
                      {!experienceBenchmark.typical_for_target_role_years
                        ?.toLowerCase()
                        .includes("year") && " years"}
                    </BenchmarkValue>
                  </BenchmarkItem>
                </BenchmarkLeftSection>
                {experienceBenchmark.gap_analysis && (
                  <GapAnalysis>
                    <strong>Gap Analysis:</strong>{" "}
                    {experienceBenchmark.gap_analysis}
                  </GapAnalysis>
                )}
              </BenchmarkContainer>
            </SectionBlock>
          )}

          {peerComparison && (
            <PeerComparisonCard peerComparison={peerComparison} />
          )}

          <CTASection>
            <CTAContent>
              <CTATitle>Ready to take the next step?</CTATitle>
              <CTAText>
                Get personalized guidance from our career advisors
              </CTAText>
            </CTAContent>
            <CTAButton onClick={handleRCBClick}>Request Callback</CTAButton>
          </CTASection>
        </>
      </RightPanel>
    </HeroContainer>
  );
};

export default ProfileMatchHeroV2;
