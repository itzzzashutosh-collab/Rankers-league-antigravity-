export interface VerificationDetails {
  title: string;
  intro: string;
  pipelines: {
    title: string;
    description: string;
    steps: string[];
  }[];
  verificationIds: {
    name: string;
    details: string;
  }[];
  qrVerification: string;
  developerApi: {
    description: string;
    endpoint: string;
    sampleResponse: string;
  };
}

export const verificationContent: VerificationDetails = {
  title: "Credentials Verification Portal",
  intro: "Ranker's League maintains a cryptographically verifiable database of candidate certificates, standings, and exam logs to ensure absolute transparency for universities and employers.",
  pipelines: [
    {
      title: "Certificate Verification",
      description: "Merit certificates issued to top-percentile achievers contain unique SHA-256 issuance hashes.",
      steps: [
        "Select the verification hash printed on the physical or digital certificate.",
        "Enter the hash in our lookup field or scan the QR index.",
        "The engine displays the candidate name, percentile standing, and contest title verified directly from the database ledger."
      ]
    },
    {
      title: "Result & Grading Verification",
      description: "To prevent rating inflation, exam responses are indexed under transaction ledgers.",
      steps: [
        "Aspirants receive audit logs of their selected response sheets.",
        "Third-party validators can request public verification of student marks using authorized credentials."
      ]
    }
  ],
  verificationIds: [
    { name: "Digital Verification IDs (VIDs)", details: "A unique identifier assigned to every verified contestant. Academic partners can query student scores using their VIDs." },
    { name: "Cryptographic Certificate Hashes", details: "Issuance details are permanently signed with an SHA-256 block that prevents duplication or alteration." }
  ],
  qrVerification: "Scan the printed QR code on any certificate using any smartphone camera. It will resolve to a secure verification link under `http://localhost:3000/verify/...` proving the recipient's authenticity.",
  developerApi: {
    description: "Verified educational institutions and coaching partners can automate validation via our REST API endpoints.",
    endpoint: "GET /api/v1/verify/credentials/:hash",
    sampleResponse: `{
  "success": true,
  "verified": true,
  "candidate": "Ashutosh Sharma",
  "contest": "IIT JEE Advanced Apex Championship",
  "percentile": 99.98,
  "rank": 42,
  "date": "2026-07-05T00:00:00Z"
}`
  }
};
