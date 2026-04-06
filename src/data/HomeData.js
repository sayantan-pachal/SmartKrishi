// component/Home/HomeData.js
import { 
  Leaf, 
  CloudSun, 
  LayoutDashboard, 
  Zap, 
  ShieldCheck, 
  TrendingUp,
  Sprout
} from "lucide-react";

export const HOME_CONTENT = {
  hero: {
    title: "Revolutionizing Agriculture through",
    highlight: "Intelligent Technology",
    description: "Empowering the modern farmer with AI-driven insights. From real-time disease diagnosis to precision weather analytics, SmartKrishi is your digital partner.",
    primaryCTA: "Start Free Trial",
    secondaryCTA: "Watch Demo"
  },
  stats: [
    { value: "40K+", label: "Farmers onboarded" },
    { value: "18%", label: "Avg. yield increase" },
    { value: "12", label: "States covered" },
    { value: "98%", label: "Uptime reliability" }
  ],
  features: [
    {
      title: "AI Disease Diagnosis",
      desc: "Our neural networks analyze leaf patterns to detect over 50+ crop diseases instantly.",
      Icon: Leaf, 
      color: "text-smart-green-600",
      bgColor: "bg-smart-green-50 dark:bg-smart-green-900/30"
    },
    {
      title: "Hyper-Local Weather",
      desc: "Receive field-specific alerts for frost, humidity shifts, and optimal harvest windows.",
      Icon: CloudSun,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/30"
    },
    {
      title: "Unified Management",
      desc: "Monitor multiple land parcels across different locations from a single command center.",
      Icon: LayoutDashboard,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/30"
    }
  ],
  about: {
    title: "Bridging the gap between earth and innovation.",
    description: "SmartKrishi was founded on a simple belief: technology should empower the people who feed the world. We combine satellite intelligence with local soil wisdom to make precision farming accessible to every acre.",
    items: [
      { icon: Zap, label: "Real-time Alerts", desc: "Instant pest and weather warnings." },
      { icon: ShieldCheck, label: "Eco-Friendly", desc: "Optimized fertilizer use for healthy soil." }
    ]
  },
  ctaSection: {
    title: "Ready to Transform Your Harvest?",
    subtitle: "Join thousands of forward-thinking farmers using SmartKrishi.",
    buttonText: "Create Account"
  }
};