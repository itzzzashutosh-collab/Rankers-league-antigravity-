import { ExamQuestion } from "../../types/exam";

export const examQuestionsContent: Record<string, ExamQuestion[]> = {
  "upsc-elite-live": [
    {
      id: "upsc-q1",
      number: 1,
      type: "single_choice",
      questionText: {
        English: "With reference to the Constitution of India, which of the following is correct regarding the Directive Principles of State Policy?",
        Hindi: "भारत के संविधान के संदर्भ में, राज्य के नीति निदेशक तत्वों के संबंध में निम्नलिखित में से कौन सा सही है?"
      },
      options: [
        {
          id: "A",
          text: {
            English: "They are enforceable by courts of law.",
            Hindi: "वे कानून की अदालतों द्वारा लागू करने योग्य हैं।"
          }
        },
        {
          id: "B",
          text: {
            English: "They are fundamental in the governance of the country.",
            Hindi: "वे देश के शासन में मौलिक हैं।"
          }
        },
        {
          id: "C",
          text: {
            English: "They override Fundamental Rights in all cases.",
            Hindi: "वे सभी मामलों में मौलिक अधिकारों पर हावी होते हैं।"
          }
        },
        {
          id: "D",
          text: {
            English: "They were imported from the French Constitution.",
            Hindi: "इन्हें फ्रांसीसी संविधान से लिया गया था।"
          }
        }
      ]
    },
    {
      id: "upsc-q2",
      number: 2,
      type: "assertion_reason",
      questionText: {
        English: "Assertion (A): The President of India is elected by an electoral college consisting of elected members of parliament and state assemblies. \nReason (R): The Constitution of India aims to achieve federal representation in presidential polls.",
        Hindi: "कथन (A): भारत के राष्ट्रपति का चुनाव एक निर्वाचक मंडल द्वारा किया जाता है जिसमें संसद और राज्य विधानसभाओं के निर्वाचित सदस्य शामिल होते हैं। \nकारण (R): भारत के संविधान का लक्ष्य राष्ट्रपति चुनावों में संघीय प्रतिनिधित्व प्राप्त करना है।"
      },
      options: [
        {
          id: "A",
          text: {
            English: "Both (A) and (R) are true and (R) is the correct explanation of (A).",
            Hindi: "दोनों (A) और (R) सत्य हैं और (R), (A) की सही व्याख्या है।"
          }
        },
        {
          id: "B",
          text: {
            English: "Both (A) and (R) are true but (R) is NOT the correct explanation of (A).",
            Hindi: "दोनों (A) और (R) सत्य हैं लेकिन (R), (A) की सही व्याख्या नहीं है।"
          }
        },
        {
          id: "C",
          text: {
            English: "(A) is true but (R) is false.",
            Hindi: "(A) सत्य है लेकिन (R) असत्य है।"
          }
        },
        {
          id: "D",
          text: {
            English: "(A) is false but (R) is true.",
            Hindi: "(A) असत्य है लेकिन (R) सत्य है।"
          }
        }
      ]
    },
    {
      id: "upsc-q3",
      number: 3,
      type: "multiple_choice",
      questionText: {
        English: "Which of the following bodies are chaired by the Prime Minister of India? Select all that apply.",
        Hindi: "निम्नलिखित में से किस निकाय की अध्यक्षता भारत के प्रधानमंत्री द्वारा की जाती है? सभी प्रासंगिक विकल्पों का चयन करें।"
      },
      options: [
        {
          id: "A",
          text: {
            English: "National Integration Council",
            Hindi: "राष्ट्रीय एकता परिषद"
          }
        },
        {
          id: "B",
          text: {
            English: "NITI Aayog",
            Hindi: "नीति आयोग"
          }
        },
        {
          id: "C",
          text: {
            English: "Inter-State Council",
            Hindi: "अंतर-राज्य परिषद"
          }
        },
        {
          id: "D",
          text: {
            English: "Finance Commission of India",
            Hindi: "भारत का वित्त आयोग"
          }
        }
      ]
    },
    {
      id: "upsc-q4",
      number: 4,
      type: "matrix_match",
      questionText: {
        English: "Match the following historical events (Column I) with their corresponding years (Column II):",
        Hindi: "निम्नलिखित ऐतिहासिक घटनाओं (स्तंभ I) का उनके संगत वर्षों (स्तंभ II) से मिलान करें:"
      },
      matrixLeft: [
        { id: "A", text: { English: "Non-Cooperation Movement", Hindi: "असहयोग आंदोलन" } },
        { id: "B", text: { English: "Quit India Movement", Hindi: "भारत छोड़ो आंदोलन" } },
        { id: "C", text: { English: "Civil Disobedience Movement", Hindi: "सविनय अवज्ञा आंदोलन" } }
      ],
      matrixRight: [
        { id: "P", text: { English: "1920", Hindi: "1920" } },
        { id: "Q", text: { English: "1930", Hindi: "1930" } },
        { id: "R", text: { English: "1942", Hindi: "1942" } }
      ]
    },
    {
      id: "upsc-q5",
      number: 5,
      type: "numerical",
      questionText: {
        English: "In the Rajya Sabha, what is the maximum number of members nominated by the President of India? Enter an integer value.",
        Hindi: "राज्यसभा में, भारत के राष्ट्रपति द्वारा मनोनीत सदस्यों की अधिकतम संख्या क्या है? एक पूर्णांक मान दर्ज करें।"
      }
    },
    {
      id: "upsc-q6",
      number: 6,
      type: "paragraph",
      paragraph: {
        English: "Read the following text: Eight people A, B, C, D, E, F, G, and H are sitting around a circular table facing the center. A sits third to the left of F. Only two people sit between F and G. D sits immediate right of G. H sits second to the left of B.",
        Hindi: "निम्नलिखित गद्यांश को पढ़ें: आठ व्यक्ति A, B, C, D, E, F, G, और H एक गोलाकार मेज के चारों ओर केंद्र की ओर मुख करके बैठे हैं। A, F के बाएं तीसरे स्थान पर बैठा है। F और G के बीच केवल दो व्यक्ति बैठे हैं। D, G के ठीक दाएं बैठा है। H, B के बाएं दूसरे स्थान पर बैठा है।"
      },
      questionText: {
        English: "Who sits third to the right of B?",
        Hindi: "B के दाएं तीसरे स्थान पर कौन बैठा है?"
      },
      options: [
        { id: "A", text: { English: "G", Hindi: "G" } },
        { id: "B", text: { English: "D", Hindi: "D" } },
        { id: "C", text: { English: "H", Hindi: "H" } },
        { id: "D", text: { English: "F", Hindi: "F" } }
      ]
    },
    {
      id: "upsc-q7",
      number: 7,
      type: "numerical",
      questionText: {
        English: "A train running at 54 km/h crosses a standing pole in 10 seconds. Find the length of the train in meters.",
        Hindi: "54 किमी/घंटे की गति से चल रही एक ट्रेन एक खड़े खंभे को 10 सेकंड में पार करती है। ट्रेन की लंबाई मीटर में ज्ञात करें।"
      }
    },
    {
      id: "upsc-q8",
      number: 8,
      type: "subjective",
      questionText: {
        English: "Explain the main differences between direct democracy and representative democracy in your own words. Your response will be reviewed by evaluators.",
        Hindi: "अपने शब्दों में प्रत्यक्ष लोकतंत्र और प्रतिनिधि लोकतंत्र के बीच मुख्य अंतर स्पष्ट करें। आपकी प्रतिक्रिया का मूल्यांकनकर्ताओं द्वारा परीक्षण किया जाएगा।"
      }
    }
  ],
  "jee-advanced-live": [
    {
      id: "jee-q1",
      number: 1,
      type: "single_choice",
      equation: "E = h\\nu = \\frac{hc}{\\lambda}",
      questionText: {
        English: "Find the energy of a photon of wavelength λ = 500 nm in eV. Use the formula displayed below:",
        Hindi: "eV में तरंग दैर्ध्य λ = 500 nm वाले फोटॉन की ऊर्जा ज्ञात करें। नीचे प्रदर्शित सूत्र का उपयोग करें:"
      },
      options: [
        { id: "A", text: { English: "2.48 eV", Hindi: "2.48 eV" } },
        { id: "B", text: { English: "1.24 eV", Hindi: "1.24 eV" } },
        { id: "C", text: { English: "4.96 eV", Hindi: "4.96 eV" } },
        { id: "D", text: { English: "3.10 eV", Hindi: "3.10 eV" } }
      ]
    },
    {
      id: "jee-q2",
      number: 2,
      type: "numerical",
      equation: "T = 2\\pi\\sqrt{\\frac{L}{g}}",
      questionText: {
        English: "A simple pendulum of length L = 1.0 m oscillates with a time period T. Calculate T in seconds assuming g = 9.8 m/s² (Enter a value rounded to 2 decimal places).",
        Hindi: "लंबाई L = 1.0 मीटर का एक साधारण लोलक आवर्तकाल T के साथ दोलन करता है। g = 9.8 मी/सेकंड² मानते हुए T की गणना सेकंड में करें (2 दशमलव स्थानों तक सही मान दर्ज करें)।"
      }
    },
    {
      id: "jee-q3",
      number: 3,
      type: "multiple_choice",
      questionText: {
        English: "Which of the following thermodynamic processes have work done equal to zero? Select all correct options.",
        Hindi: "निम्नलिखित में से किस ऊष्मागतिकी प्रक्रियाओं में किया गया कार्य शून्य के बराबर होता है? सभी सही विकल्पों का चयन करें।"
      },
      options: [
        { id: "A", text: { English: "Isochoric process", Hindi: "समान आयतनिक प्रक्रिया" } },
        { id: "B", text: { English: "Free expansion of an ideal gas", Hindi: "एक आदर्श गैस का मुक्त विस्तार" } },
        { id: "C", text: { English: "Isobaric process", Hindi: "समान दबाव प्रक्रिया" } },
        { id: "D", text: { English: "Isothermal compression", Hindi: "समान तापमान संपीड़न" } }
      ]
    },
    {
      id: "jee-q4",
      number: 4,
      type: "single_choice",
      equation: "pH = -\\log[H^+]",
      questionText: {
        English: "What is the pH of a 1.0 × 10⁻³ M hydrochloric acid (HCl) solution?",
        Hindi: "1.0 × 10⁻³ M हाइड्रोक्लोरिक एसिड (HCl) समाधान का pH क्या है?"
      },
      options: [
        { id: "A", text: { English: "3", Hindi: "3" } },
        { id: "B", text: { English: "4", Hindi: "4" } },
        { id: "C", text: { English: "2", Hindi: "2" } },
        { id: "D", text: { English: "7", Hindi: "7" } }
      ]
    },
    {
      id: "jee-q5",
      number: 5,
      type: "numerical",
      questionText: {
        English: "Enter the valency of Carbon in Carbon Dioxide (CO2).",
        Hindi: "कार्बन डाइऑक्साइड (CO2) में कार्बन की संयोजकता दर्ज करें।"
      }
    },
    {
      id: "jee-q6",
      number: 6,
      type: "matrix_match",
      questionText: {
        English: "Match the mathematical function equations (Column I) with their limits as x approaches 0 (Column II):",
        Hindi: "गणितीय फलन समीकरणों (स्तंभ I) का x के 0 की ओर अग्रसर होने पर उनकी सीमाओं (स्तंभ II) से मिलान करें:"
      },
      matrixLeft: [
        { id: "A", text: { English: "sin(x)/x", Hindi: "sin(x)/x" } },
        { id: "B", text: { English: "(1 - cos(x))/x²", Hindi: "(1 - cos(x))/x²" } },
        { id: "C", text: { English: "ln(1 + x)/x", Hindi: "ln(1 + x)/x" } }
      ],
      matrixRight: [
        { id: "P", text: { English: "1", Hindi: "1" } },
        { id: "Q", text: { English: "0.5", Hindi: "0.5" } },
        { id: "R", text: { English: "0", Hindi: "0" } }
      ]
    },
    {
      id: "jee-q7",
      number: 7,
      type: "programming",
      questionText: {
        English: "Write a function in Python that returns the sum of all elements in an array. Enter your code in the workspace input.",
        Hindi: "पायथन में एक फलन लिखें जो एक सरणी में सभी तत्वों का योग लौटाता है। कार्यक्षेत्र इनपुट में अपना कोड दर्ज करें।"
      }
    }
  ],
  "default": [
    {
      id: "default-q1",
      number: 1,
      type: "single_choice",
      questionText: {
        English: "What is the capital of India?",
        Hindi: "भारत की राजधानी क्या है?"
      },
      options: [
        { id: "A", text: { English: "New Delhi", Hindi: "नई दिल्ली" } },
        { id: "B", text: { English: "Mumbai", Hindi: "मुंबई" } }
      ]
    }
  ]
};
export default examQuestionsContent;
