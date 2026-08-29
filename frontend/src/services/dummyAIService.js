/**
 * Dummy AI Service
 *
 * Simulates AI-powered functionality for the Research Papers module.
 *
 * This service is intentionally independent from the backend and
 * external AI APIs. It can later be replaced with a real AI service
 * without changing the Research Papers UI.
 */

/**
 * Simulate AI processing time.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a dummy AI summary for a research paper.
 *
 * @param {Object} paper
 * @returns {Promise<Object>}
 */
export async function summarizePaper(paper) {
  // Simulate AI processing
  await delay(1500);

  // Handle empty/invalid input
  if (!paper || typeof paper !== "object" || !paper.title) {
    throw new Error("Invalid research paper.");
  }

  const title = paper.title;
  const researchArea = paper.category || "Academic Research";

  return {
    summary: `This research paper, "${title}", explores important concepts and challenges within ${researchArea}. The study presents a structured approach to understanding the research problem and highlights findings that may contribute to further academic investigation and practical applications.`,

    keyFindings: [
      `The study identifies important patterns and challenges related to ${researchArea}.`,
      "The proposed approach demonstrates potential for improving research outcomes.",
      "The findings provide a foundation for further research and practical application.",
    ],

    contributions: [
      "Introduces a structured approach to the research problem.",
      "Provides insights that can support future academic research.",
      "Highlights opportunities for further development and validation.",
    ],

    keywords: [
      researchArea,
      "Research Methods",
      "Academic Research",
      "Innovation",
    ],
  };
}

/**
 * Generate dummy AI research recommendations.
 *
 * @returns {Promise<Array>}
 */
export async function getTrendingTopics() {
  // Simulate AI processing
  await delay(800);

  return [
    {
      id: 1,
      title: "Federated Climate Modeling",
      description:
        "Collaborative machine learning approaches for analyzing climate data while preserving data privacy.",
      researchArea: "Machine Learning",
      trend: "+42%",
      trendLabel: "Hot",
      keywords: [
        "Federated Learning",
        "Climate AI",
        "Climate Modeling",
      ],
    },
    {
      id: 2,
      title: "Post-Quantum Identity Systems",
      description:
        "Emerging approaches for protecting digital identity systems against future quantum computing threats.",
      researchArea: "Cybersecurity",
      trend: "+31%",
      trendLabel: "Rising",
      keywords: [
        "Post-Quantum Cryptography",
        "Digital Identity",
        "Security",
      ],
    },
    {
      id: 3,
      title: "Multimodal Diagnostic AI",
      description:
        "AI systems combining multiple types of medical data to improve diagnostic support and clinical research.",
      researchArea: "Health Informatics",
      trend: "+27%",
      trendLabel: "Rising",
      keywords: [
        "Multimodal AI",
        "Medical Imaging",
        "Diagnostics",
      ],
    },
    {
      id: 4,
      title: "Cross-Lab Knowledge Graphs",
      description:
        "Knowledge graph approaches for connecting datasets, researchers, and findings across research institutions.",
      researchArea: "Research Systems",
      trend: "+18%",
      trendLabel: "Rising",
      keywords: [
        "Knowledge Graphs",
        "Research Collaboration",
        "Data Integration",
      ],
    },
  ];
}