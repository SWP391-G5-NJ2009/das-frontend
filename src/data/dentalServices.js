import {
  Banknote,
  Clock,
  Cross,
  ShieldCheck,
  Smile,
  Sparkles,
  Syringe,
  WandSparkles,
} from "lucide-react";

export const dentalServices = [
  {
    title: "Wisdom tooth extraction",
    description:
      "Safe removal of impacted or misaligned wisdom teeth with Piezotome ultrasonic technology for faster recovery.",
    duration: "30 - 60 minutes",
    price: "from 1,500,000 VND",
    Icon: Smile,
  },
  {
    title: "Orthodontics",
    description:
      "Advanced orthodontics with metal braces, ceramic braces, or clear Invisalign aligners.",
    duration: "1 - 3 year",
    price: "from 30,000,000 VND",
    Icon: ShieldCheck,
  },
  {
    title: "Teeth whitening",
    description:
      "Brighten your smile with safe laser whitening technology and visible results after one visit.",
    duration: "45 - 60 minutes",
    price: "from 2,500,000 VND",
    Icon: WandSparkles,
  },
  {
    title: "General checkup",
    description:
      "Comprehensive oral health checks, routine scaling, and preventive dental guidance.",
    duration: "30 minutes",
    price: "from 300,000 VND",
    Icon: Cross,
  },
  {
    title: "Dental implants",
    description:
      "Replace missing teeth with titanium implant roots for lasting function and aesthetics.",
    duration: "60 - 90 minutes/tooth",
    price: "from 15,000,000 VND",
    Icon: Syringe,
  },
  {
    title: "Porcelain crowns",
    description:
      "Restore tooth shape and color with premium porcelain while preserving natural tooth structure.",
    duration: "2 - 3 visits",
    price: "from 3,000,000 VND",
    Icon: Sparkles,
  },
];

export const serviceMetaIcons = {
  DurationIcon: Clock,
  PriceIcon: Banknote,
};
