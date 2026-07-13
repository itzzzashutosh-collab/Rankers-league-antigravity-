export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "Engineering" | "Medical" | "Civil Services" | "Competition Strategy" | "Announcements" | "Platform Updates" | "Success Stories";
  tags: string[];
  readingTime: string;
  author: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  publishDate: string;
  content: string;
  imageGradient: string;
}

export const blogContent: BlogArticle[] = [
  {
    id: "blog-1",
    slug: "upsc-prelims-accuracy-strategy",
    title: "Maximizing Accuracy in High-Stake MCQs: UPSC Preliminary Examination Analysis",
    description: "An analytical breakdown of response-patterns, negative marking mitigation, and time distribution metrics during elite civil services evaluations.",
    category: "Competition Strategy",
    tags: ["UPSC CSE", "Accuracy", "Strategy"],
    readingTime: "6 min read",
    author: {
      name: "Dr. Ramesh Iyer",
      role: "Academic Dean",
      avatarInitials: "RI",
    },
    publishDate: "July 01, 2026",
    content: "When attempting high-stake competitive examinations like the UPSC Civil Services Preliminary exam, accuracy is the single most critical factor separating the top 1% from the rest. With a 1/3rd negative marking penalty, guessing blindly is mathematically counterproductive. Here, we outline the three-pass system used by our national toppers. Pass one: answer only absolute certainty items. Pass two: resolve 50-50 options. Pass three: mitigate risk by analyzing option-pattern dynamics.",
    imageGradient: "from-amber-500/10 to-yellow-600/10",
  },
  {
    id: "blog-2",
    slug: "iit-jee-advanced-adaptive-prep",
    title: "Navigating Adaptive Difficulty Scaling in Engineering Entrance Championships",
    description: "How to mentally calibrate for multi-option correct grids and variable marking schemes in JEE Advanced level championships.",
    category: "Engineering",
    tags: ["JEE Advanced", "Physics", "Math"],
    readingTime: "8 min read",
    author: {
      name: "Prof. Alok Verma",
      role: "Engineering Advisor",
      avatarInitials: "AV",
    },
    publishDate: "June 28, 2026",
    content: "The JEE Advanced exam template is notorious for shifting parameters. One year it is partial marking, the next it is single digit integers. Our evaluation algorithm maps this variance. To prepare, candidates must learn to look for hidden dependencies. In multi-option correct questions, selecting one wrong option yields -2, whereas leaving it empty might still yield +1. Understanding these parameters is as important as solving the equations.",
    imageGradient: "from-violet-500/10 to-purple-600/10",
  },
  {
    id: "blog-3",
    slug: "neet-biology-score-maximization",
    title: "NEET UG: Speed, Recall, and Accuracy Calibration in Biology Section",
    description: "Tactics to resolve 90 biology questions in under 40 minutes while maintaining a 98% accuracy index.",
    category: "Medical",
    tags: ["NEET UG", "Biology", "Speed"],
    readingTime: "5 min read",
    author: {
      name: "Dr. Meera Nair",
      role: "Medical Curriculum Lead",
      avatarInitials: "MN",
    },
    publishDate: "June 25, 2026",
    content: "Biology constitutes 50% of the NEET paper. Because physics and chemistry questions require calculation steps, maximizing biology speed is essential. The ideal target is 90 questions in 40 minutes. This requires sub-second recall. Study structures like flowcharts and structural diagrams to bypass reading paragraphs during examinations.",
    imageGradient: "from-rose-500/10 to-pink-600/10",
  }
];
