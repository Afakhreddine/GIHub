// Repo-managed Schedule tab resources.
// Built by Hermes from guidelines, weekly updates, weeklyArchive, targeted pulls, and AutoContent quizzes.

const scheduleResources = {
  "stomach-pathology": {
    "guidelines": [
      {
        "org": "AGA",
        "year": "2020",
        "month": "February",
        "topic": "Gastric Intestinal Metaplasia",
        "urgency": "Moderate",
        "title": "AGA Clinical Practice Guidelines on Management of Gastric Intestinal Metaplasia",
        "summary": "This AGA guideline addresses the management of incidentally detected gastric intestinal metaplasia, recommending H. pylori testing and eradication and providing conditional guidance against routine surveillance endoscopy in most patients. It uses GRADE methodology and applies to adults with GIM identified on upper endoscopy.",
        "url": "https://pubmed.ncbi.nlm.nih.gov/31816298/",
        "relevanceScore": 12,
        "relevanceReason": "Matched schedule topic terms: gastric, h pylori, intestinal metaplasia",
        "status": "candidate"
      },
      {
        "org": "ACG",
        "year": "2024",
        "month": "September",
        "topic": "Helicobacter Pylori",
        "urgency": "High",
        "title": "ACG Clinical Guideline: Treatment of Helicobacter pylori Infection",
        "summary": "Evidence-based recommendations for the diagnosis and treatment of H. pylori infection in clinical practice.",
        "url": "https://pubmed.ncbi.nlm.nih.gov/39626064/",
        "relevanceScore": 7,
        "relevanceReason": "Matched schedule topic terms: h pylori, helicobacter",
        "status": "candidate"
      },
      {
        "org": "ASGE",
        "year": "2023",
        "month": "November",
        "topic": "Esophageal and Gastric Cancer – ESD",
        "urgency": "High",
        "title": "American Society for Gastrointestinal Endoscopy guideline on endoscopic submucosal dissection for the management of early esophageal and gastric cancers: summary and recommendations",
        "summary": "GRADE-based guideline on the role of ESD versus EMR and surgery for management of early esophageal squamous cell carcinoma, esophageal adenocarcinoma, and gastric adenocarcinoma. Published in Gastrointest Endosc 2023; Volume 98, Issue 5.",
        "url": "https://www.asge.org/home/resources/publications/guidelines/american-society-for-gastrointestinal-endoscopy-guideline-on-endoscopic-submucosal-dissection-for-the-management-of-early-esophageal-and-gastric-cancers",
        "relevanceScore": 7,
        "relevanceReason": "Matched schedule topic terms: gastric, gastric cancer",
        "status": "candidate"
      }
    ],
    "newsAndArticles": [
      {
        "section": "News and Articles",
        "title": "Daily consumption of sugary drinks linked to more than double risk for gastric cancer",
        "oneLineSummary": "Daily consumption was associated with HR 2.45 (95% CI 1.49-4.04) for gastric cancer.",
        "doi": "",
        "pmid": "",
        "source": "healio.com",
        "sourceRepository": "weeklyArchive",
        "url": "https://www.ghadvances.org/article/S2772-5723(26)00218-9/fulltext",
        "date": "Aug 27, 2026",
        "topic": "Gastric Cancer Prevention",
        "type": "Research",
        "relevanceScore": 12,
        "relevanceReason": "Matched schedule topic terms: gastric, gastric cancer, sugary drinks",
        "status": "candidate",
        "addedBy": "schedule-resource-population",
        "addedAt": "2026-09-11",
        "eventDate": "2026-09-04"
      }
    ],
    "quiz": [
      {
        "question": "According to the 2024 ACG guidelines, which of the following is the preferred empiric first-line treatment regimen for a patient with H. pylori infection in North America when antibiotic susceptibility is unknown?",
        "options": [
          "A. Bismuth quadruple therapy (BQT) for 14 days",
          "B. Clarithromycin triple therapy for 10 days",
          "C. Levofloxacin triple therapy for 14 days",
          "D. Bismuth quadruple therapy (BQT) for 7 days"
        ],
        "correct": "A",
        "explanation": "Current guidelines prioritize 14-day bismuth quadruple therapy as the preferred empiric choice when susceptibility data are unavailable.",
        "hint": "Consider the regimen that addresses rising resistance rates by using four different agents for a full two-week course."
      },
      {
        "question": "A patient is found to have incidental Gastric Intestinal Metaplasia (GIM) during an upper endoscopy for reflux. According to the AGA clinical practice guidelines, what is the next most appropriate management step?",
        "options": [
          "A. Testing for and eradication of H. pylori",
          "B. Scheduling a surveillance endoscopy in 1 year",
          "C. Immediate referral for endoscopic submucosal dissection",
          "D. Initiating high-dose PPI therapy and repeat biopsy in 6 months"
        ],
        "correct": "A",
        "explanation": "The AGA guideline strongly recommends H. pylori testing and treatment in patients with GIM to reduce the risk of progression.",
        "hint": "The guideline focuses on addressing the primary treatable risk factor associated with the development of metaplasia."
      },
      {
        "question": "In a patient who has already failed an 'optimized' 14-day bismuth quadruple therapy (BQT) for H. pylori, what is the preferred empiric alternative salvage regimen according to the 2024 ACG guidelines?",
        "options": [
          "A. Rifabutin triple therapy for 14 days",
          "B. Standard clarithromycin triple therapy for 14 days",
          "C. Sequential therapy for 10 days",
          "D. Levofloxacin quadruple therapy for 14 days"
        ],
        "correct": "A",
        "explanation": "Rifabutin triple therapy is recommended as a suitable empiric salvage option for patients who have already failed an optimized BQT.",
        "hint": "Identify the antibiotic that is frequently used in multi-drug resistant cases and does not share resistance pathways with clarithromycin."
      },
      {
        "question": "A recent meta-analysis of global H. pylori prevalence between 1980 and 2022 found that while adult prevalence has significantly declined, which demographic has not seen a significant reduction in infection rates?",
        "options": [
          "A. Children and adolescents",
          "B. Adults in the Western Pacific region",
          "C. Adults in the Southeast Asian region",
          "D. Females in the African region"
        ],
        "correct": "A",
        "explanation": "The study highlights that while adult prevalence dropped from 52.6% to 43.9%, prevalence in children remained high at 35.1% without significant decline.",
        "hint": "Look for the younger age group where public health measures have yet to show a statistical impact on infection trends."
      },
      {
        "question": "In the pragmatic randomized clinical trial conducted in Taiwan, how did the invitation for H. pylori stool antigen (HPSA) + FIT assessment affect gastric cancer incidence compared to FIT alone in the primary analysis?",
        "options": [
          "A. There was no significant difference in gastric cancer incidence rates.",
          "B. It significantly reduced gastric cancer mortality but not incidence.",
          "C. It significantly reduced both incidence and mortality.",
          "D. It increased gastric cancer incidence due to over-diagnosis."
        ],
        "correct": "A",
        "explanation": "In the initial analysis of the invited individuals, incidence rates were 0.032% vs 0.037%, which was not statistically significant (P = .23).",
        "hint": "Distinguish between the raw primary outcomes and the 'post hoc' analyses that adjusted for participation rates."
      },
      {
        "question": "Recent evidence published regarding dietary habits suggests that the daily consumption of sugary drinks is associated with what level of risk for developing gastric cancer?",
        "options": [
          "A. More than double the risk (HR 2.45)",
          "B. A slight increase in risk (HR 1.25)",
          "C. A fourfold increase in risk (HR 4.04)",
          "D. No significant association with gastric cancer"
        ],
        "correct": "A",
        "explanation": "Daily consumption of sugary drinks was linked to a Hazard Ratio of 2.45, indicating a more than twofold increase in risk.",
        "hint": "The reported Hazard Ratio falls between 2 and 3."
      },
      {
        "question": "For a treatment-naive patient with H. pylori infection who does NOT have a penicillin allergy, which of the following is considered a suitable empiric alternative to bismuth quadruple therapy?",
        "options": [
          "A. Potassium-competitive acid blocker (P-CAB) dual therapy for 14 days",
          "B. Metronidazole-based triple therapy for 7 days",
          "C. Doxycycline-based quadruple therapy for 10 days",
          "D. High-dose PPI monotherapy for 28 days"
        ],
        "correct": "A",
        "explanation": "P-CAB dual therapy for 14 days is recognized as a suitable empiric alternative in patients without a penicillin allergy.",
        "hint": "This alternative uses a newer class of acid suppressants combined with only one antibiotic."
      },
      {
        "question": "In the Taiwan H. pylori screening trial, what was the eradication rate among those participants who tested positive for the stool antigen and received antibiotic treatment?",
        "options": [
          "A. 91.9%",
          "B. 71.4%",
          "C. 49.6%",
          "D. 38.5%"
        ],
        "correct": "A",
        "explanation": "Of the participants who received antibiotics in the HPSA + FIT group, 91.9% successfully achieved eradication.",
        "hint": "The correct figure represents a high level of success for the therapeutic intervention phase of the trial."
      },
      {
        "question": "According to the ACG clinical guideline, when is it appropriate to use salvage regimens containing clarithromycin or levofloxacin for persistent H. pylori infection?",
        "options": [
          "A. Only if antibiotic susceptibility is confirmed",
          "B. Whenever bismuth quadruple therapy has failed twice",
          "C. As the standard empiric second-line choice in North America",
          "D. Only in patients with a documented penicillin allergy"
        ],
        "correct": "A",
        "explanation": "Due to high resistance rates, these specific antibiotics should not be used empiricially in salvage therapy without sensitivity testing.",
        "hint": "Think about the role of antimicrobial stewardship and the impact of pre-existing resistance on treatment failure."
      },
      {
        "question": "The AGA guidelines on Gastric Intestinal Metaplasia (GIM) apply specifically to which of the following clinical scenarios?",
        "options": [
          "A. Adults with GIM identified incidentally on upper endoscopy",
          "B. Pediatric patients with a family history of gastric cancer",
          "C. Patients with known hereditary diffuse gastric cancer syndromes",
          "D. Patients presenting with hematemesis and visible gastric ulcers"
        ],
        "correct": "A",
        "explanation": "The AGA guideline is specifically framed for the management of GIM that is detected during endoscopies performed for other reasons.",
        "hint": "The scope of the guideline is defined by how the pathology is typically discovered in routine clinical practice."
      }
    ],
    "quizStatus": "autocontent-complete",
    "quizSourcePdfs": [
      "stomach-pathology.pdf"
    ],
    "fetchedAt": "2026-09-11T00:00:00.000Z",
    "resourceStatus": "approved",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "quizGeneratedAt": "2026-09-16T00:10:00.000Z"
  },
  "gi-bleeding": {
    "guidelines": [
      {
        "org": "ACG",
        "year": "2021",
        "month": "February",
        "topic": "Upper GI Bleeding",
        "urgency": "High",
        "title": "ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding",
        "summary": "Guidelines for management of patients with overt upper gastrointestinal bleeding including risk assessment and endoscopic therapy.",
        "url": "https://docs.bvsalud.org/biblioref/2021/07/1281327/acg_clinical_guideline__upper_gastrointestinal_and14.pdf",
        "relevanceScore": 7,
        "relevanceReason": "Matched schedule topic terms: bleeding, ulcer bleeding",
        "status": "candidate"
      },
      {
        "org": "ASGE",
        "year": "2023",
        "month": "May",
        "topic": "Acute Upper GI Bleeding",
        "urgency": "High",
        "title": "ASGE guideline on the role of endoscopy in the management of acute non-variceal upper GI bleeding: summary and recommendations",
        "summary": "Updated GRADE-based guideline on endoscopic management of acute non-variceal upper GI bleeding with recommendations on risk stratification, timing, hemostatic methods, and post-hemostasis care. Published in Gastrointestinal Endoscopy Volume 98.",
        "url": "https://www.asge.org/home/resources/publications/guidelines",
        "relevanceScore": 6,
        "relevanceReason": "Matched schedule topic terms: bleeding, variceal, hemostasis",
        "status": "candidate"
      },
      {
        "org": "AASLD",
        "year": "2025",
        "month": "Jan",
        "topic": "General GI",
        "urgency": "High",
        "title": "TIPS, Variceal Embolization, and Retrograde Transvenous Obliteration",
        "summary": "AASLD practice guideline/guidance topic page for TIPS, Variceal Embolization, and Retrograde Transvenous Obliteration, included from the official AASLD practice-guidelines disease library.",
        "url": "https://www.aasld.org/practice-guidelines/transjugular-intrahepatic-portosystemic-shunt-tips",
        "relevanceScore": 2,
        "relevanceReason": "Matched schedule topic terms: variceal",
        "status": "candidate"
      }
    ],
    "newsAndArticles": [],
    "quiz": [
      {
        "question": "In the OCEAN study investigating angiodysplasia-related bleeding, what was the primary effect of octreotide long-acting release (40 mg every 28 days) on patient outcomes?",
        "options": [
          "A. It significantly reduced the mean number of transfusion units compared to standard care.",
          "B. It eliminated the need for any subsequent endoscopic procedures for one year.",
          "C. It was only effective in patients with a baseline requirement of more than 20 RBC units.",
          "D. It significantly improved 1-year survival rates compared to endoscopic therapy alone."
        ],
        "correct": "A",
        "explanation": "The study demonstrated a mean reduction of 10.2 transfusion units in the octreotide group compared to the standard of care group.",
        "hint": "Focus on the primary outcome measure related to the total number of red blood cell and iron supplements needed."
      },
      {
        "question": "According to the 2024 randomized controlled trial published in Hepatology, how did tranexamic acid (TXA) affect patients with advanced cirrhosis (Child-Turcotte-Pugh B or C) presenting with UGIB?",
        "options": [
          "A. It significantly reduced the 5-day and 6-week mortality rates.",
          "B. It reduced failure to control bleeding by day 5, specifically by preventing bleeding from EVL sites.",
          "C. It increased the risk of systemic fibrinolysis and subsequent thromboembolic events.",
          "D. It was only effective in patients with Child-Turcotte-Pugh class A cirrhosis."
        ],
        "correct": "B",
        "explanation": "TXA was found to significantly lower 5-day treatment failure, largely attributed to its effect on esophageal endoscopic variceal ligation sites.",
        "hint": "Consider the impact on short-term bleeding control versus long-term survival."
      },
      {
        "question": "Which pre-endoscopic pharmacologic intervention is recommended in recent reviews to improve visibility during an endoscopy for acute upper gastrointestinal bleeding (UGIB)?",
        "options": [
          "A. Erythromycin",
          "B. Tranexamic acid",
          "C. High-dose Vitamin K",
          "D. Activated charcoal"
        ],
        "correct": "A",
        "explanation": "Erythromycin is a prokinetic agent used pre-endoscopically to clear the stomach of blood and clots, thereby improving the diagnostic yield.",
        "hint": "This medication is used for its prokinetic properties rather than its effect on coagulation."
      },
      {
        "question": "Based on AASLD practice guidance, which procedure is emphasized for the management of esophageal, gastric, and ectopic variceal hemorrhage when medical/endoscopic therapy is insufficient?",
        "options": [
          "A. Surgical portacaval shunt",
          "B. Transjugular intrahepatic portosystemic shunt (TIPS)",
          "C. Splenectomy",
          "D. Routine balloon tamponade for all patients"
        ],
        "correct": "B",
        "explanation": "TIPS is a well-established intervention for treating the complications of portal hypertension, including refractory variceal bleeding.",
        "hint": "Think of a percutaneous vascular procedure that creates a low-resistance channel between the portal and systemic circulation."
      },
      {
        "question": "For a patient with peptic ulcer disease (PUD) exhibiting high-risk stigmata, which endoscopic therapy is recommended by current evidence-based management reviews?",
        "options": [
          "A. Over-the-scope clips (OTSCs) and TC-325 powder spray",
          "B. Epinephrine injection alone",
          "C. Argon Plasma Coagulation (APC) as the sole therapy",
          "D. Barium coating of the ulcer bed"
        ],
        "correct": "A",
        "explanation": "Modern endoscopic management for high-risk PUD includes these advanced mechanical and topical hemostatic agents.",
        "hint": "Look for a combination involving a mechanical clipping device and a hemostatic powder."
      },
      {
        "question": "What is the recommended restrictive red blood cell (RBC) transfusion threshold for most patients with UGIB, provided they do not have significant cardiovascular disease?",
        "options": [
          "A. Hemoglobin < 7 g/dL",
          "B. Hemoglobin < 10 g/dL",
          "C. Hematocrit < 35%",
          "D. Hemoglobin < 12 g/dL"
        ],
        "correct": "A",
        "explanation": "A restrictive transfusion policy, typically using a threshold of 7 g/dL, is recommended to improve outcomes in UGIB.",
        "hint": "The strategy involves waiting until the oxygen-carrying capacity is significantly low to avoid volume overload and portal pressure spikes."
      },
      {
        "question": "In the context of post-endoscopic management, how should suspected rebleeding in a high-risk PUD patient initially be managed?",
        "options": [
          "A. Immediate referral for arterial embolization",
          "B. Repeat endoscopy",
          "C. Emergency surgical gastrectomy",
          "D. Increasing the IV PPI dose without further visualization"
        ],
        "correct": "B",
        "explanation": "Current management reviews suggest that rebleeding in high-risk PUD should initially be evaluated with a repeat endoscopic look.",
        "hint": "The first step for recurrent bleeding is usually the same modality used for the initial diagnosis."
      },
      {
        "question": "Which of the following describes the ASGE's approach to creating guidelines like the one for non-variceal upper GI bleeding?",
        "options": [
          "A. Recommendations are based strictly on expert opinion without literature review.",
          "B. They use the GRADE methodology to assess the quality of evidence and strength of recommendations.",
          "C. Guidelines serve as a legally binding substitute for a physician's individual opinion.",
          "D. Guidelines are updated every 10 years regardless of new evidence."
        ],
        "correct": "B",
        "explanation": "The ASGE utilizes the Grading of Recommendation Assessment, Development and Evaluation (GRADE) framework for its evidence-based guidelines.",
        "hint": "Recall the acronym for the standard system used to rate the certainty of evidence in clinical practice guidelines."
      },
      {
        "question": "Regarding patients with cirrhosis and UGIB, what additional pre-endoscopic therapies are recommended beyond standard PPI and prokinetics?",
        "options": [
          "A. Prophylactic antibiotics and vasoactive medications",
          "B. Oral anticoagulation to prevent portal vein thrombosis",
          "C. High-volume saline resuscitation to reach a Hemoglobin of 12 g/dL",
          "D. Routine placement of a Nasogastric (NG) tube for gastric lavage"
        ],
        "correct": "A",
        "explanation": "These interventions are critical in cirrhotics to reduce the risk of infection and lower portal pressure during an acute bleed.",
        "hint": "Think about the specific complications of liver disease, such as spontaneous bacterial peritonitis and elevated portal pressures."
      },
      {
        "question": "What did the 1995 NIH conference conclude regarding the use of TIPS compared to medical or surgical therapy?",
        "options": [
          "A. TIPS was ineffective for acute control of variceal bleeding.",
          "B. It was unclear exactly when TIPS should be used relative to other therapies.",
          "C. TIPS was definitively superior to large volume paracentesis for all forms of ascites.",
          "D. Surgical shunts were recommended over TIPS for all portal hypertension complications."
        ],
        "correct": "B",
        "explanation": "While effective, the optimal timing and selection of patients compared to medical or surgical options remained uncertain at that time.",
        "hint": "The conference acknowledged the efficacy of the procedure but noted a lack of clear comparative guidelines for patient selection."
      }
    ],
    "quizStatus": "autocontent-complete",
    "quizSourcePdfs": [
      "gi-bleeding.pdf"
    ],
    "fetchedAt": "2026-09-11T00:00:00.000Z",
    "resourceStatus": "approved",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "quizGeneratedAt": "2026-09-16T00:10:00.000Z"
  },
  "hypertriglyceridemia-acute-pancreatitis": {
    "guidelines": [
      {
        "org": "ASGE",
        "year": "2023",
        "month": "April",
        "topic": "Benign Pancreatic Disease",
        "urgency": "Moderate",
        "title": "ASGE guideline on the role of endoscopy in the management of benign pancreatic disease: summary and recommendations",
        "summary": "Updated ASGE GRADE-based guideline on the endoscopic management of benign pancreatic conditions including acute pancreatitis, pancreatic duct disruption, and pancreatic fluid collections. Provides specific recommendations on drainage technique selection and timing.",
        "url": "https://www.asge.org/home/resources/publications/guidelines/asge-guideline-on-benign-pancreatic-disease-summary",
        "relevanceScore": 12,
        "relevanceReason": "Matched schedule topic terms: pancreatitis, acute pancreatitis, benign pancreatic disease",
        "status": "candidate"
      },
      {
        "org": "ACG",
        "year": "2024",
        "month": "March",
        "topic": "Acute Pancreatitis",
        "urgency": "High",
        "title": "American College of Gastroenterology Guidelines: Management of Acute Pancreatitis",
        "summary": "Comprehensive guidelines for the diagnosis, risk stratification, and management of acute pancreatitis.",
        "url": "https://pubmed.ncbi.nlm.nih.gov/38857482/",
        "relevanceScore": 7,
        "relevanceReason": "Matched schedule topic terms: pancreatitis, acute pancreatitis",
        "status": "candidate"
      }
    ],
    "newsAndArticles": [],
    "quiz": [
      {
        "question": "According to the 2024 ACG guidelines, which of the following is a primary indication for early endoscopic retrograde cholangiopancreatography (ERCP) in patients with biliary pancreatitis?",
        "options": [
          "A. All patients with suspected gallstone-induced pancreatitis to prevent recurrence",
          "B. Cases of biliary pancreatitis complicated by cholangitis",
          "C. Any patient with a serum lipase level greater than three times the normal limit",
          "D. Only patients who have already undergone a cholecystectomy"
        ],
        "correct": "B",
        "explanation": "Clinical guidelines specify that early ERCP is necessary when biliary pancreatitis is complicated by an infection of the bile duct.",
        "hint": "Consider the specific clinical complication that often requires urgent biliary decompression."
      },
      {
        "question": "In the Danish multicenter randomized controlled trial regarding methylnaltrexone in acute pancreatitis, what was the primary finding concerning the Pancreatitis Activity Scoring System (PASS) score at 48 hours?",
        "options": [
          "A. Methylnaltrexone significantly reduced the PASS score compared to placebo",
          "B. The PASS score was significantly higher in the methylnaltrexone group, suggesting harm",
          "C. There was no significant difference in the PASS score between the groups",
          "D. The PASS score was only reduced in patients with existing opioid-induced constipation"
        ],
        "correct": "C",
        "explanation": "The trial concluded that methylnaltrexone treatment did not achieve superiority over placebo for reducing disease severity.",
        "hint": "Think about whether the peripherally acting \\mu-opioid receptor antagonist successfully altered the trajectory of the disease."
      },
      {
        "question": "A prospective cohort study on infected pancreatic necrosis (IPN) identified several predictors of mortality. Which of the following factors was included in the five-predictor logistic regression nomogram?",
        "options": [
          "A. Serum amylase level at the time of diagnosis",
          "B. Body Mass Index (BMI)",
          "C. Time from onset to first intervention",
          "D. Gender of the patient"
        ],
        "correct": "C",
        "explanation": "This factor, along with age and organ failure metrics, was found to have a significant non-linear relationship with mortality.",
        "hint": "Focus on factors related to the clinical timeline and the severity of the inflammatory complications."
      },
      {
        "question": "The ACG 2024 guidelines address the role of nutrition in acute pancreatitis. What is the current recommendation regarding refeeding in these patients?",
        "options": [
          "A. Patients should remain NPO for at least 72 hours to allow the pancreas to 'rest'",
          "B. Parenteral nutrition is preferred over oral or enteral routes in the first 48 hours",
          "C. Early refeeding is safe and important in preventing complications",
          "D. Refeeding should only begin once the patient is entirely pain-free without analgesics"
        ],
        "correct": "C",
        "explanation": "The guidelines emphasize the safety and importance of early refeeding as a strategy to improve patient outcomes.",
        "hint": "Reflect on how early intervention might benefit the integrity of the gastrointestinal system."
      },
      {
        "question": "Regarding the survival of patients with infected pancreatic necrosis (IPN), the 'conditional survival' (CS) analysis indicated that:",
        "options": [
          "A. The risk of death increases the longer a patient survives past 30 days",
          "B. Survival rates remain stagnant regardless of the duration of stay",
          "C. Real-time survival improves gradually since diagnosis",
          "D. Most deaths occur after 60 days of hospitalization"
        ],
        "correct": "C",
        "explanation": "The study demonstrated that 90-day survival rates increased from 0.778 at baseline to over 0.99 for those surviving 75 days.",
        "hint": "Think about the trend of survival probability for a patient who has already successfully navigated the first few weeks of the illness."
      },
      {
        "question": "In the study of methylnaltrexone for acute pancreatitis, how did the treatment affect morphine equivalent doses and pain scores at 48 hours?",
        "options": [
          "A. It significantly reduced the need for opioids by enhancing endogenous analgesia",
          "B. It increased pain interference due to the blockade of peripheral receptors",
          "C. There were no differences between the methylnaltrexone and placebo groups in pain severity or opioid use",
          "D. It allowed for a 50% reduction in opioid requirements due to synergistic effects"
        ],
        "correct": "C",
        "explanation": "The trial confirmed that the addition of methylnaltrexone did not alter analgesia or the amount of opioids required.",
        "hint": "Consider the 'non-inferiority' of the analgesic effect when using a peripherally acting antagonist."
      },
      {
        "question": "The updated ASGE guideline on the management of benign pancreatic disease specifically addresses the endoscopic management of which complication?",
        "options": [
          "A. Malignant pancreatic ductal adenocarcinoma",
          "B. Pancreatic fluid collections and duct disruptions",
          "C. Type 1 Autoimmune Pancreatitis diagnostic criteria",
          "D. Routine screening for pancreatic cysts in asymptomatic patients"
        ],
        "correct": "B",
        "explanation": "The ASGE provides specific recommendations on the selection and timing of drainage for these specific benign conditions.",
        "hint": "Focus on the procedural aspects mentioned, such as drainage techniques."
      },
      {
        "question": "What percentage of patients with acute pancreatitis are estimated to progress to severe complications such as pancreatic necrosis or organ failure?",
        "options": [
          "A. Approximately 5%",
          "B. Nearly one-fifth of patients",
          "C. Over 50% of all hospital admissions",
          "D. Exactly 35% across all populations"
        ],
        "correct": "B",
        "explanation": "The ACG abstract notes that while most patients have mild disease, almost 20% experience severe complications.",
        "hint": "Identify the fraction of the population that moves from typical symptoms to the need for intensive or radiologic intervention."
      },
      {
        "question": "The random survival forest model for IPN patients identified which of the following as one of the seven foremost predictors of mortality?",
        "options": [
          "A. Serum Calcium levels",
          "B. Duration of organ failure",
          "C. History of alcohol consumption",
          "D. Presence of a pseudocyst"
        ],
        "correct": "B",
        "explanation": "Both the number and the duration of organ failure were identified as critical predictors of mortality in the prospective cohort.",
        "hint": "Consider the physiologic markers of systemic failure over time."
      },
      {
        "question": "According to the systematic review on post-ERCP pancreatitis (PEP), PEP is characterized as:",
        "options": [
          "A. A rare complication occurring in less than 0.1% of procedures",
          "B. The most common serious adverse event associated with the procedure",
          "C. A complication primarily driven by the patient's age and gender alone",
          "D. An inevitable outcome that cannot be predicted or risk-stratified"
        ],
        "correct": "B",
        "explanation": "The source identifies PEP as the leading serious complication following endoscopic retrograde cholangiopancreatography.",
        "hint": "Identify the relative frequency and clinical significance of this specific post-procedural event."
      }
    ],
    "quizStatus": "autocontent-complete",
    "quizSourcePdfs": [
      "hypertriglyceridemia-acute-pancreatitis.pdf"
    ],
    "fetchedAt": "2026-09-11T00:00:00.000Z",
    "resourceStatus": "approved",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "quizGeneratedAt": "2026-09-16T00:10:00.000Z"
  },
  "liver-pathology": {
    "guidelines": [
      {
        "org": "ACG",
        "year": "2023",
        "month": "June",
        "topic": "Nonalcoholic Fatty Liver Disease / MASLD",
        "urgency": "Moderate",
        "title": "ACG Clinical Guideline: Nonalcoholic Fatty Liver Disease (NAFLD/MASLD)",
        "summary": "Guideline on the diagnosis, staging, and management of metabolic dysfunction-associated steatotic liver disease (formerly NAFLD/NASH), including lifestyle interventions, pharmacotherapy, and monitoring for fibrosis progression. Published Am J Gastroenterol June 2023.",
        "url": "https://gi.org/guidelines/",
        "relevanceScore": 17,
        "relevanceReason": "Matched schedule topic terms: liver, fibrosis, steatotic, fatty liver, masld",
        "status": "candidate"
      },
      {
        "org": "AASLD",
        "year": "2023",
        "month": "May",
        "topic": "NAFLD/MASLD",
        "urgency": "High",
        "title": "AASLD Practice Guidance on the clinical assessment and management of nonalcoholic fatty liver disease",
        "summary": "Comprehensive guidance on diagnosis and management of NAFLD emphasizing advances in noninvasive risk stratification and therapeutics.",
        "url": "https://pubmed.ncbi.nlm.nih.gov/36727674/",
        "relevanceScore": 11,
        "relevanceReason": "Matched schedule topic terms: liver, fatty liver, masld, nafld",
        "status": "candidate"
      },
      {
        "org": "ASGE",
        "year": "2026",
        "month": "January",
        "topic": "Esophageal & Gastric Varices in Cirrhosis",
        "urgency": "High",
        "title": "ASGE Guideline on management of esophageal and gastric varices in patients with cirrhosis",
        "summary": "Forthcoming ASGE guideline providing evidence-based recommendations on screening, surveillance, and endoscopic treatment of esophageal and gastric varices in cirrhotic patients, including band ligation and cyanoacrylate injection. Addresses primary and secondary prophylaxis strategies in the context of updated portal hypertension management.",
        "url": "https://www.asge.org/home/resources/publications/guidelines/asge-guideline-varices-cirrhosis",
        "relevanceScore": 7,
        "relevanceReason": "Matched schedule topic terms: cirrhosis, portal hypertension",
        "status": "candidate"
      },
      {
        "org": "AGA",
        "year": "2026",
        "month": "Mar",
        "topic": "General GI",
        "urgency": "High",
        "title": "Clinical care pathway for the risk stratification and management of patients with MASLD",
        "summary": "AGA guidance addressing Clinical care pathway for the risk stratification and management of patients with MASLD. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
        "url": "https://gastro.org/clinical-guidance/clinical-care-pathway-for-the-risk-stratification-and-management-of-patients-with-masld/",
        "relevanceScore": 2,
        "relevanceReason": "Matched schedule topic terms: masld",
        "status": "candidate"
      }
    ],
    "newsAndArticles": [
      {
        "section": "News and Articles",
        "title": "Global consensus updates MASLD risk stratification, treatment initiation, and response monitoring",
        "oneLineSummary": "Special commentary from the Global NASH/MASH Council updates consensus recommendations for MASLD/MASH risk stratification, treatment initiation, and monitoring response.",
        "doi": "10.1016/j.cgh.2026.03.030",
        "pmid": "",
        "source": "Clinical Gastroenterology and Hepatology",
        "sourceRepository": "weekly",
        "url": "https://doi.org/10.1016/j.cgh.2026.03.030",
        "date": "Sep 2026",
        "topic": "MASLD",
        "type": "Guideline",
        "relevanceScore": 10,
        "relevanceReason": "Matched schedule topic terms: liver, masld, mash, nash, steatotic",
        "status": "candidate",
        "addedBy": "schedule-resource-population",
        "addedAt": "2026-09-11",
        "eventDate": "2026-09-18"
      },
      {
        "section": "News and Articles",
        "title": "6-Month Rx Results in Functional Cure for Some With Hep B",
        "oneLineSummary": "Functional cure occurred in 20% vs 0% in B-Well 1 (risk difference 17.5 percentage points, 95% CI 14.6-20.3; P<0.001) and 19% vs 0% in B-Well 2 (risk difference 13.3, 95% CI 10.4-16.1; P<0.001).",
        "doi": "",
        "pmid": "42206582",
        "source": "gastroendonews.com",
        "sourceRepository": "weeklyArchive",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42206582/",
        "date": "Aug 28, 2026",
        "topic": "Hepatitis B",
        "type": "Research",
        "relevanceScore": 2,
        "relevanceReason": "Matched schedule topic terms: hepatitis",
        "status": "candidate",
        "addedBy": "schedule-resource-population",
        "addedAt": "2026-09-11",
        "eventDate": "2026-09-18"
      }
    ],
    "quiz": [
      {
        "question": "According to the recent systematic review and network meta-analysis of pharmacological therapies for MASH, which of the following agents achieved the highest SUCRA (Surface Under the Cumulative Ranking Curve) score for fibrosis regression of at least one stage without worsening of steatohepatitis?",
        "options": [
          "A. Pegozafermin",
          "B. Tirzepatide",
          "C. Resmetirom",
          "D. Semaglutide"
        ],
        "correct": "A",
        "explanation": "In the network meta-analysis, pegozafermin was ranked as the most effective intervention for fibrosis regression with a SUCRA score of 79.92.",
        "hint": "Consider the ranking of a fibroblast growth factor 21 (FGF-21) analog mentioned in the meta-analysis."
      },
      {
        "question": "In the B-Well 1 and B-Well 2 phase 3 trials, what was the primary mechanism of action for bepirovirsen in the treatment of chronic hepatitis B virus (HBV) infection?",
        "options": [
          "A. Antisense oligonucleotide targeting HBV transcripts",
          "B. Nucleoside analogue inhibiting viral polymerase",
          "C. Capsid assembly modulator blocking viral encasement",
          "D. Monoclonal antibody neutralizing HBsAg"
        ],
        "correct": "A",
        "explanation": "Bepirovirsen works by binding to and promoting the degradation of viral RNA, which can lead to a reduction in viral proteins and a potential functional cure.",
        "hint": "Focus on the specific molecular strategy used to degrade viral genetic messages."
      },
      {
        "question": "Based on the B-Well trial results for chronic HBV, which laboratory abnormality was identified as the most common grade 3 or higher adverse event in patients receiving bepirovirsen?",
        "options": [
          "A. Increase in alanine aminotransferase (ALT) level",
          "B. Decrease in absolute neutrophil count",
          "C. Serum creatinine elevation",
          "D. Bilirubin elevation reaching Hy's Law criteria"
        ],
        "correct": "A",
        "explanation": "ALT flares were noted in 6% of the bepirovirsen group and are often associated with the immune clearance of infected hepatocytes during treatment.",
        "hint": "Think about common markers of liver inflammation or immune-mediated hepatocyte turnover."
      },
      {
        "question": "Which of the following describes the definition of a 'functional cure' as used in the phase 3 trials of bepirovirsen for noncirrhotic chronic HBV infection?",
        "options": [
          "A. Sustained HBsAg loss and HBV DNA below the LLOQ for at least 24 weeks after therapy",
          "B. Undetectable HBV DNA while remaining on stable nucleoside analogue therapy",
          "C. Complete eradication of intrahepatic cccDNA",
          "D. HBeAg seroconversion with persistence of low-level HBsAg"
        ],
        "correct": "A",
        "explanation": "A functional cure implies the host immune system has controlled the virus to the point where surface antigen is undetectable and viral load is suppressed post-treatment.",
        "hint": "This term refers to a specific clinical state maintained after the discontinuation of all antiviral medications."
      },
      {
        "question": "In the context of MASLD (formerly NAFLD) management, what is the primary clinical utility of the 'Clinical care pathway' recently emphasized by the AGA and other major societies?",
        "options": [
          "A. Standardizing noninvasive fibrosis risk stratification and management",
          "B. Mandating liver biopsy for all patients with metabolic syndrome",
          "C. Providing a legal framework for insurance coverage of bariatric surgery",
          "D. Replacing lifestyle interventions with early-stage pharmacotherapy"
        ],
        "correct": "A",
        "explanation": "Care pathways are designed to help clinicians move beyond simple diagnosis toward actionable staging using noninvasive tests to guide therapy.",
        "hint": "Consider the shift toward using biomarkers and elastography to determine the severity of liver scarring."
      },
      {
        "question": "Which of the following pharmacological agents ranked highest for achieving MASH resolution without worsening fibrosis in the 2025 network meta-analysis?",
        "options": [
          "A. Pegozafermin",
          "B. Lanifibranor",
          "C. Vitamin E",
          "D. Obeticholic acid"
        ],
        "correct": "A",
        "explanation": "Pegozafermin achieved the highest SUCRA score (91.75) for MASH resolution, slightly outperforming other potent agents like survodutide.",
        "hint": "This agent is a long-acting glycopegylated FGF-21 analog."
      },
      {
        "question": "The ASGE guideline on the management of esophageal varices in cirrhosis highlights which combination of endoscopic techniques for the treatment of gastric varices?",
        "options": [
          "A. Cyanoacrylate injection and band ligation",
          "B. Sclerotherapy and argon plasma coagulation",
          "C. Radiofrequency ablation and mucosal resection",
          "D. Hemostatic powder spray and clip placement"
        ],
        "correct": "A",
        "explanation": "These techniques are standard endoscopic approaches for managing gastric and esophageal varices, with cyanoacrylate being particularly relevant for certain gastric variceal types.",
        "hint": "Think about the specialized 'glue' used for gastric varices versus the standard 'looping' method for esophageal ones."
      },
      {
        "question": "What significant change in nomenclature was introduced to replace the term 'Nonalcoholic Fatty Liver Disease (NAFLD)' to better reflect the underlying pathophysiology and reduce stigma?",
        "options": [
          "A. Metabolic dysfunction-associated steatotic liver disease (MASLD)",
          "B. Metabolic-associated fatty liver disease (MAFLD)",
          "C. Insulin-resistant hepatosteatosis syndrome (IRHS)",
          "D. Metabolic dysfunction-associated steatohepatitis (MASH)"
        ],
        "correct": "A",
        "explanation": "The new nomenclature integrates metabolic risk factors into the definition and uses 'steatotic' instead of 'fatty' to avoid stigmatizing language.",
        "hint": "The new acronym starts with 'M' and ends with 'SLD'."
      },
      {
        "question": "In the pooled analysis of the B-Well trials for bepirovirsen, what was the approximate percentage of patients who achieved a functional cure at week 72?",
        "options": [
          "A. 19-20%",
          "B. 5-10%",
          "C. 40-50%",
          "D. 75-80%"
        ],
        "correct": "A",
        "explanation": "The B-Well 1 and B-Well 2 trials reported functional cure rates of 20% and 19% respectively, which were significantly higher than the 0% in the placebo groups.",
        "hint": "The percentage is approximately one-fifth of the treated population."
      },
      {
        "question": "Based on the pharmacological comparison for MASH resolution, which of the following 'dual' agents (targeting both GIP and GLP-1 receptors) was significantly better than placebo?",
        "options": [
          "A. Tirzepatide",
          "B. Semaglutide",
          "C. Liraglutide",
          "D. Resmetirom"
        ],
        "correct": "A",
        "explanation": "Tirzepatide is a dual GIP and GLP-1 receptor agonist that demonstrated high efficacy for MASH resolution in the network meta-analysis.",
        "hint": "This medication is known for its dual action on glucose-dependent insulinotropic polypeptide and glucagon-like peptide-1 receptors."
      }
    ],
    "quizStatus": "autocontent-complete",
    "quizSourcePdfs": [
      "liver-pathology.pdf"
    ],
    "fetchedAt": "2026-09-11T00:00:00.000Z",
    "resourceStatus": "approved",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "quizGeneratedAt": "2026-09-16T00:10:00.000Z"
  },
  "ibd": {
    "guidelines": [
      {
        "org": "ASGE",
        "year": "2024",
        "month": "November",
        "topic": "Inflammatory Bowel Disease – Endoscopic Diagnosis and Management",
        "urgency": "Moderate",
        "title": "American Society for Gastrointestinal Endoscopy guideline on the endoscopic diagnosis and management of adult inflammatory bowel disease: summary and recommendations",
        "summary": "This ASGE guideline provides updated evidence-based recommendations for the endoscopic diagnosis, surveillance, and management of adult inflammatory bowel disease (IBD), including Crohn's disease and ulcerative colitis. It addresses the role of colonoscopy, chromoendoscopy, dysplasia surveillance, and endoscopic therapy for IBD-related strictures and complications.",
        "url": "https://www.asge.org/home/resources/publications/guidelines/american-society-for-gastrointestinal-endoscopy-guideline-on-the-endoscopic-diagnosis-and-management-of-adult-inflammatory-bowel-disease--summary-and-recommendations",
        "relevanceScore": 19,
        "relevanceReason": "Matched schedule topic terms: inflammatory bowel, crohn, crohn s, ulcerative colitis, colitis",
        "status": "candidate"
      },
      {
        "org": "AGA",
        "year": "2025",
        "month": "November",
        "topic": "Crohn's Disease Pharmacologic Management",
        "urgency": "High",
        "title": "AGA Living Clinical Practice Guideline on the Pharmacologic Management of Moderate-to-Severe Crohn's Disease",
        "summary": "This living guideline provides 16 recommendations for pharmacologic management of moderate-to-severe Crohn's disease, focusing on advanced therapies, immunomodulators, and combination therapy. It includes recommendations for early advanced therapy and treating to endoscopic remission.",
        "url": "https://www.gastrojournal.org/article/S0016-5085(25)06091-3/fulltext",
        "relevanceScore": 7,
        "relevanceReason": "Matched schedule topic terms: crohn, crohn s",
        "status": "candidate"
      },
      {
        "org": "ACG",
        "year": "2025",
        "month": "June",
        "topic": "Ulcerative Colitis",
        "urgency": "High",
        "title": "ACG Clinical Guideline Update: Ulcerative Colitis in Adults",
        "summary": "Updated guideline for the management of adult patients with ulcerative colitis providing evidence-based recommendations for treatment approaches.",
        "url": "https://www.guidelinecentral.com/guideline/13311/",
        "relevanceScore": 7,
        "relevanceReason": "Matched schedule topic terms: ulcerative colitis, colitis",
        "status": "candidate"
      }
    ],
    "newsAndArticles": [
      {
        "section": "News and Articles",
        "title": "Six-trial analysis finds no new upadacitinib safety signals in IBD",
        "oneLineSummary": "Integrated safety analysis of six phase 3 ulcerative colitis and Crohn's disease trials; Patients with moderate-to-severe ulcerative colitis or Crohn's disease; Induction: 725 placebo and 1,393 upadacitinib; maintenance/long-term: 468 placebo, 471 at 15 mg, and 480 at 30 mg; 5,149 patient-years of long-term exposure.",
        "doi": "",
        "pmid": "",
        "source": "news.gastro.org",
        "sourceRepository": "weekly",
        "url": "https://www.cghjournal.org/article/S1542-3565(26)00145-X/fulltext",
        "date": "Sep 3, 2026",
        "topic": "IBD",
        "type": "Research",
        "relevanceScore": 18,
        "relevanceReason": "Matched schedule topic terms: ibd, crohn, crohn s, ulcerative colitis, upadacitinib",
        "status": "candidate",
        "addedBy": "schedule-resource-population",
        "addedAt": "2026-09-11",
        "eventDate": "2026-09-22"
      },
      {
        "section": "News and Articles",
        "title": "Upadacitinib linked to higher remission after UC therapy failure",
        "oneLineSummary": "Week-16 remission was 48% with upadacitinib vs 27% with each comparator.",
        "doi": "",
        "pmid": "",
        "source": "news.gastro.org",
        "sourceRepository": "weeklyArchive",
        "url": "https://www.cghjournal.org/article/S1542-3565(26)00561-6/pdf",
        "date": "Aug 28, 2026",
        "topic": "IBD",
        "type": "Research",
        "relevanceScore": 6,
        "relevanceReason": "Matched schedule topic terms: ibd, uc, upadacitinib",
        "status": "candidate",
        "addedBy": "schedule-resource-population",
        "addedAt": "2026-09-11",
        "eventDate": "2026-09-22"
      },
      {
        "section": "News and Articles",
        "title": "Variation in antibody response evident ‘long before symptoms’ of IBD develop",
        "oneLineSummary": "Disease-specific antibody differences were detectable as early as approximately 10 years before diagnosis, with repertoire variability increasing around four years before diagnosis.",
        "doi": "",
        "pmid": "",
        "source": "healio.com",
        "sourceRepository": "weeklyArchive",
        "url": "https://gut.bmj.com/content/early/2026/07/23/gutjnl-2025-337762",
        "date": "Aug 26, 2026",
        "topic": "IBD",
        "type": "Research",
        "relevanceScore": 2,
        "relevanceReason": "Matched schedule topic terms: ibd",
        "status": "candidate",
        "addedBy": "schedule-resource-population",
        "addedAt": "2026-09-11",
        "eventDate": "2026-09-22"
      },
      {
        "section": "News and Articles",
        "title": "Half of patients flared within two years of stopping anti-TNF for UC, trial finds",
        "oneLineSummary": "In an open-label noninferiority RCT at 19 Norwegian hospitals, 172 patients with deeply remitted ulcerative colitis were randomized to stop or continue anti-TNF; two-year endoscopic remission was 80.5% versus 96.3%, and flares occurred in 52% versus 12%.",
        "doi": "",
        "pmid": "42557857",
        "source": "news.gastro.org",
        "sourceRepository": "weekly",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42557857/",
        "date": "Sep 15, 2026",
        "topic": "Ulcerative Colitis",
        "type": "Research",
        "relevanceScore": 6,
        "relevanceReason": "New Weekly Update card matches IBD (ulcerative colitis, uc).",
        "status": "candidate",
        "addedBy": "weekly-cron-screener",
        "addedAt": "2026-09-20",
        "eventDate": "2026-09-22"
      },
      {
        "section": "News and Articles",
        "title": "Home calprotectin monitoring fails to reduce ulcerative colitis flares",
        "oneLineSummary": "The PROMOTE UC randomized trial included 611 adults with ulcerative colitis in clinical remission, randomizing 308 to standard care and 303 to proactive fecal calprotectin home monitoring every two months for 18 months.",
        "doi": "",
        "pmid": "42336164",
        "source": "Gastroenterology",
        "sourceRepository": "weekly",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42336164/",
        "date": "Jun 23, 2026",
        "topic": "Ulcerative Colitis",
        "type": "Research",
        "relevanceScore": 6,
        "relevanceReason": "New Weekly Update card matches IBD (ulcerative colitis, uc).",
        "status": "candidate",
        "addedBy": "weekly-cron-screener",
        "addedAt": "2026-09-21",
        "eventDate": "2026-09-22"
      }
    ],
    "quiz": [
      {
        "question": "According to the 2025 ACG guidelines, which of the following defines 'deep remission' in patients with ulcerative colitis (UC)?",
        "options": [
          "A. The combination of symptomatic remission and endoscopic healing.",
          "B. Normalization of fecal calprotectin (FC) and C-reactive protein (CRP) levels.",
          "C. Sustained clinical remission without the use of corticosteroids for at least 6 months.",
          "D. Histologic remission confirmed by a gastrointestinal pathologist."
        ],
        "correct": "A",
        "explanation": "Deep remission is defined as achieving both patient-reported symptomatic improvement and restoration of intact mucosa without friability.",
        "hint": "Consider the dual requirements of patient-reported outcomes and mucosal appearance."
      },
      {
        "question": "In a prospective study of IBD patients treated with Infliximab (IFX), which pharmacokinetic parameter was identified as the primary predictor of infection risk?",
        "options": [
          "A. Preinfusion trough concentration (C_{trough}).",
          "B. Cumulative exposure represented by AUC_{0-8wk}.",
          "C. The presence of high-titer anti-Infliximab antibodies.",
          "D. Peak serum concentration measured 2 hours post-infusion."
        ],
        "correct": "B",
        "explanation": "The area under the concentration-time curve over 8 weeks was found to be the primary predictor, suggesting cumulative exposure drives safety concerns.",
        "hint": "Focus on the parameter that represents total drug exposure over a dosing interval."
      },
      {
        "question": "A patient is diagnosed with ulcerative colitis involving the rectum and extending to the splenic flexure. How should this disease extent be categorized according to ACG guidelines?",
        "options": [
          "A. Proctitis",
          "B. Left-sided colitis",
          "C. Extensive colitis",
          "D. Proctosigmoiditis"
        ],
        "correct": "B",
        "explanation": "Left-sided colitis is defined as disease extending from the sigmoid colon up to the splenic flexure.",
        "hint": "Identify the specific anatomical landmark that separates left-sided disease from extensive disease."
      },
      {
        "question": "Based on the integration of six phase 3 trials, what was the safety finding regarding upadacitinib use in patients with moderate-to-severe IBD?",
        "options": [
          "A. Increased risk of major adverse cardiovascular events (MACE) compared to placebo.",
          "B. No new safety signals were identified compared to previous data.",
          "C. A dose-dependent increase in gastrointestinal perforations.",
          "D. Safety signals were only evident in the 30 mg maintenance group."
        ],
        "correct": "B",
        "explanation": "The six-trial analysis confirmed the existing safety profile of upadacitinib without uncovering novel risks in UC or Crohn's disease.",
        "hint": "Consider the overall conclusion regarding the emergence of novel adverse events."
      },
      {
        "question": "When managing a patient with mildly to moderately active UC, within what timeframe should they be reassessed to determine the response to induction therapy?",
        "options": [
          "A. 2 weeks",
          "B. 4 weeks",
          "C. 8 weeks",
          "D. 12 weeks"
        ],
        "correct": "C",
        "explanation": "The 2025 ACG guidelines recommend reassessing patients within 8 weeks to determine if the induction therapy has been successful.",
        "hint": "Think of a standard two-month window often used in clinical trials for induction endpoints."
      },
      {
        "question": "According to research on the pre-clinical phase of IBD, how long before a formal diagnosis can variation in antibody response be detected?",
        "options": [
          "A. Approximately 1 year",
          "B. Approximately 4 years",
          "C. Approximately 10 years",
          "D. Approximately 20 years"
        ],
        "correct": "C",
        "explanation": "Disease-specific antibody differences were found to be detectable as early as 10 years before the onset of symptoms and diagnosis.",
        "hint": "The detection of these markers significantly predates even the earliest symptomatic changes."
      },
      {
        "question": "In the context of Infliximab therapy, which of the following was associated with a REDUCED risk of infection (OR: 0.51) in the GLMM analysis?",
        "options": [
          "A. Subcutaneous (SC) dosing vs Intravenous (IV) dosing.",
          "B. Low-dose immunomodulator use.",
          "C. Concomitant corticosteroid use.",
          "D. Younger age at diagnosis."
        ],
        "correct": "B",
        "explanation": "Surprisingly, the use of low-dose immunomodulators was associated with a lower risk of infection in this specific cohort analysis.",
        "hint": "Look for a therapy often used in combination with biologics that showed an unexpected protective association in this study."
      },
      {
        "question": "For a patient suspected of having UC, what is the recommended endoscopic procedure to confirm the diagnosis and assess disease extent?",
        "options": [
          "A. Flexible sigmoidoscopy with rectal biopsy.",
          "B. Colonoscopy with intubation of the ileum and biopsies of affected and unaffected areas.",
          "C. Wireless capsule endoscopy to evaluate the entire small bowel.",
          "D. Upper endoscopy and cross-sectional imaging for all patients."
        ],
        "correct": "B",
        "explanation": "Guidelines require full colonoscopy and ileal intubation to distinguish UC from Crohn's and accurately map disease extent.",
        "hint": "A complete evaluation of the colon and the final segment of the small intestine is necessary."
      },
      {
        "question": "What was the week-16 remission rate for patients who had failed prior therapy when treated with upadacitinib, compared to comparator therapies?",
        "options": [
          "A. 35% with upadacitinib vs 15% with comparator.",
          "B. 48% with upadacitinib vs 27% with comparator.",
          "C. 60% with upadacitinib vs 40% with comparator.",
          "D. Remission rates were equal across both groups at week 16."
        ],
        "correct": "B",
        "explanation": "Patients with prior UC therapy failure achieved a significantly higher remission rate of 48% with upadacitinib compared to 27% with other treatments.",
        "hint": "The remission rate for the drug of interest was nearly double that of the comparator in this refractory group."
      },
      {
        "question": "Which of the following is considered a 'weaker' prognostic factor when deciding whether to treat mildly to moderately active UC with therapies usually reserved for moderate-to-severe disease?",
        "options": [
          "A. Severe endoscopic activity (e.g., UCEIS score).",
          "B. Age alone.",
          "C. Previous need for hospitalization.",
          "D. Low serum albumin levels."
        ],
        "correct": "B",
        "explanation": "Guidelines state that age alone is a weaker prognostic factor than endoscopic severity, though young age combined with other factors is significant.",
        "hint": "Identify the factor that requires combination with other clinical findings to carry significant weight in shared decision-making."
      }
    ],
    "quizStatus": "autocontent-complete",
    "quizSourcePdfs": [
      "ibd.pdf"
    ],
    "fetchedAt": "2026-09-11T00:00:00.000Z",
    "resourceStatus": "approved",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "quizGeneratedAt": "2026-09-16T00:10:00.000Z"
  },
  "ibd-gi-tumors-pathology": {
    "guidelines": [
      {
        "org": "ASGE",
        "year": "2024",
        "month": "November",
        "topic": "Inflammatory Bowel Disease – Endoscopic Diagnosis and Management",
        "urgency": "Moderate",
        "title": "American Society for Gastrointestinal Endoscopy guideline on the endoscopic diagnosis and management of adult inflammatory bowel disease: summary and recommendations",
        "summary": "This ASGE guideline provides updated evidence-based recommendations for the endoscopic diagnosis, surveillance, and management of adult inflammatory bowel disease (IBD), including Crohn's disease and ulcerative colitis. It addresses the role of colonoscopy, chromoendoscopy, dysplasia surveillance, and endoscopic therapy for IBD-related strictures and complications.",
        "url": "https://www.asge.org/home/resources/publications/guidelines/american-society-for-gastrointestinal-endoscopy-guideline-on-the-endoscopic-diagnosis-and-management-of-adult-inflammatory-bowel-disease--summary-and-recommendations",
        "relevanceScore": 14,
        "relevanceReason": "Matched schedule topic terms: inflammatory bowel, crohn, ulcerative colitis, dysplasia",
        "status": "candidate"
      },
      {
        "org": "ACG",
        "year": "2025",
        "month": "Aug",
        "topic": "IBD",
        "urgency": "High",
        "title": "Global Consensus Statement on the Management of Pregnancy in Inflammatory Bowel Disease",
        "summary": "ACG guidance addressing Global Consensus Statement on the Management of Pregnancy in Inflammatory Bowel Disease. Included in the repo-managed guideline library from society guidance pages with an item-level source link when available.",
        "url": "https://www.doi.org/10.14309/ajg.0000000000003651",
        "relevanceScore": 5,
        "relevanceReason": "Matched schedule topic terms: inflammatory bowel",
        "status": "candidate"
      },
      {
        "org": "AGA",
        "year": "2024",
        "month": "December",
        "topic": "Ulcerative Colitis Pharmacologic Management",
        "urgency": "High",
        "title": "AGA Living Clinical Practice Guideline on Pharmacological Management of Moderate-to-Severe Ulcerative Colitis",
        "summary": "This living guideline provides comprehensive recommendations for pharmacological management of moderate-to-severe ulcerative colitis. It includes 14 recommendations on advanced therapies, combination therapy, and treatment positioning.",
        "url": "https://www.gastrojournal.org/article/S0016-5085(24)05563-X/fulltext",
        "relevanceScore": 5,
        "relevanceReason": "Matched schedule topic terms: ulcerative colitis",
        "status": "candidate"
      }
    ],
    "newsAndArticles": [
      {
        "section": "News and Articles",
        "title": "Six-trial analysis finds no new upadacitinib safety signals in IBD",
        "oneLineSummary": "Integrated safety analysis of six phase 3 ulcerative colitis and Crohn's disease trials; Patients with moderate-to-severe ulcerative colitis or Crohn's disease; Induction: 725 placebo and 1,393 upadacitinib; maintenance/long-term: 468 placebo, 471 at 15 mg, and 480 at 30 mg; 5,149 patient-years of long-term exposure.",
        "doi": "",
        "pmid": "",
        "source": "news.gastro.org",
        "sourceRepository": "weekly",
        "url": "https://www.cghjournal.org/article/S1542-3565(26)00145-X/fulltext",
        "date": "Sep 3, 2026",
        "topic": "IBD",
        "type": "Research",
        "relevanceScore": 16,
        "relevanceReason": "Matched schedule topic terms: ibd, crohn, crohn s, ulcerative colitis, colitis",
        "status": "candidate",
        "addedBy": "schedule-resource-population",
        "addedAt": "2026-09-11",
        "eventDate": "2026-09-25"
      },
      {
        "section": "News and Articles",
        "title": "Lynch syndrome surveillance linked to lower mortality, but not fewer cancers",
        "oneLineSummary": "More frequent surveillance was not associated with lower colorectal cancer incidence or fewer late-stage cancers.",
        "doi": "10.1136/gutjnl-2025-337379",
        "pmid": "",
        "source": "news.gastro.org",
        "sourceRepository": "weeklyArchive",
        "url": "https://doi.org/10.1136/gutjnl-2025-337379",
        "date": "Aug 27, 2026",
        "topic": "Hereditary Colorectal Cancer",
        "type": "Research",
        "relevanceScore": 7,
        "relevanceReason": "Matched schedule topic terms: colorectal cancer, lynch",
        "status": "candidate",
        "addedBy": "schedule-resource-population",
        "addedAt": "2026-09-11",
        "eventDate": "2026-09-25"
      },
      {
        "section": "News and Articles",
        "title": "Colonoscopy screening lowered colorectal cancer incidence 19% over 13 years",
        "oneLineSummary": "Multicountry population-based randomized invitation trial (NordICC), intention-to-screen analysis; Screening-naive adults aged 55-64 years in Norway, Poland, and Sweden; 84,583 participants; median follow-up 13 years.",
        "doi": "",
        "pmid": "",
        "source": "news.gastro.org",
        "sourceRepository": "weekly",
        "url": "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(26)00508-8/abstract",
        "date": "Sep 2, 2026",
        "topic": "Colorectal Cancer Screening",
        "type": "Research",
        "relevanceScore": 5,
        "relevanceReason": "Matched schedule topic terms: colorectal cancer",
        "status": "candidate",
        "addedBy": "schedule-resource-population",
        "addedAt": "2026-09-11",
        "eventDate": "2026-09-25"
      },
      {
        "section": "News and Articles",
        "title": "Positive interval FIT after colonoscopy supports offering repeat colonoscopy",
        "oneLineSummary": "Population-based British Columbia Colon Screening Program cohort study; 169,117 patients undergoing colonoscopy between 2013 and 2021; 275 developed post-colonoscopy colorectal cancer during median follow-up of about 43 months.",
        "doi": "",
        "pmid": "",
        "source": "GI & Hepatology News",
        "sourceRepository": "weekly",
        "url": "https://www.cghjournal.org/article/S1542-3565(26)00353-8/fulltext",
        "date": "Jun 12, 2026",
        "topic": "Colorectal Cancer Screening",
        "type": "Research",
        "relevanceScore": 5,
        "relevanceReason": "Matched schedule topic terms: colorectal cancer",
        "status": "candidate",
        "addedBy": "schedule-resource-population",
        "addedAt": "2026-09-11",
        "eventDate": "2026-09-25"
      },
      {
        "section": "News and Articles",
        "title": "Daily consumption of sugary drinks linked to more than double risk for gastric cancer",
        "oneLineSummary": "Daily consumption was associated with HR 2.45 (95% CI 1.49-4.04) for gastric cancer.",
        "doi": "",
        "pmid": "",
        "source": "healio.com",
        "sourceRepository": "weeklyArchive",
        "url": "https://www.ghadvances.org/article/S2772-5723(26)00218-9/fulltext",
        "date": "Aug 27, 2026",
        "topic": "Gastric Cancer Prevention",
        "type": "Research",
        "relevanceScore": 5,
        "relevanceReason": "Matched schedule topic terms: gastric cancer",
        "status": "candidate",
        "addedBy": "schedule-resource-population",
        "addedAt": "2026-09-11",
        "eventDate": "2026-09-25"
      }
    ],
    "quiz": [
      {
        "question": "In the management of pregnant patients with inflammatory bowel disease (IBD), what is the central guiding principle recommended by the Global Consensus Group to achieve the best outcomes for the infant?",
        "options": [
          "A. The health of the mother best supports the health of the infant.",
          "B. Fetal safety should always take precedence over maternal symptom control.",
          "C. All IBD medications should be discontinued during the first trimester to prevent teratogenicity.",
          "D. Neonatal outcomes are primarily determined by the mode of delivery rather than maternal disease activity."
        ],
        "correct": "A",
        "explanation": "The consensus emphasizes that maintaining maternal disease control is the primary driver for successful pregnancy and neonatal outcomes.",
        "hint": "Consider the relationship between maternal wellness and neonatal health mentioned in the consensus statement."
      },
      {
        "question": "A 13-year follow-up analysis of the NordICC trial evaluated the impact of colonoscopy screening invitations on colorectal cancer (CRC) incidence. What was the observed reduction in CRC incidence in the intention-to-screen analysis?",
        "options": [
          "A. 19%",
          "B. 50%",
          "C. 5%",
          "D. 84%"
        ],
        "correct": "A",
        "explanation": "The multicountry randomized trial found that being invited to colonoscopy screening lowered the incidence of CRC by 19% over a 13-year median follow-up.",
        "hint": "The reduction was significant but reflected the challenges of an intention-to-screen population analysis."
      },
      {
        "question": "Regarding Lynch syndrome surveillance, what is the primary clinical benefit of frequent surveillance according to recent findings?",
        "options": [
          "A. Lower overall mortality",
          "B. A significant reduction in colorectal cancer incidence",
          "C. Decreased rates of late-stage cancer diagnosis",
          "D. Prevention of extracolonic malignancies"
        ],
        "correct": "A",
        "explanation": "The evidence indicates that while surveillance may not prevent the occurrence of cancer, it is linked to better survival outcomes and lower mortality.",
        "hint": "Distinguish between the occurrence of the disease and the ultimate survival of the patient."
      },
      {
        "question": "An integrated safety analysis of six phase 3 trials for upadacitinib in patients with ulcerative colitis and Crohn's disease concluded which of the following?",
        "options": [
          "A. No new safety signals were identified compared to existing data.",
          "B. Safety signals were significantly higher in the 30 mg maintenance group compared to induction.",
          "C. A new association between upadacitinib and gastric cancer was discovered.",
          "D. The placebo group had higher rates of serious adverse events than the 15 mg group."
        ],
        "correct": "A",
        "explanation": "The analysis of over 5,000 patient-years of exposure showed a safety profile consistent with previous findings for the drug.",
        "hint": "Consider the long-term safety exposure data and whether the results were unexpected."
      },
      {
        "question": "The AGA Living Clinical Practice Guideline on pharmacological management of moderate-to-severe ulcerative colitis (UC) includes 14 specific recommendations. Which of these is a major focus area of the guideline?",
        "options": [
          "A. Advanced therapies and treatment positioning",
          "B. Surgical techniques for total proctocolectomy",
          "C. Management of mild, distal ulcerative proctitis",
          "D. Standardization of random biopsy protocols for dysplasia"
        ],
        "correct": "A",
        "explanation": "The guideline emphasizes the role and sequence of advanced therapies, including combination therapy, for managing moderate-to-severe UC.",
        "hint": "Focus on the pharmacological scope and the level of disease severity being addressed."
      },
      {
        "question": "According to the British Columbia Colon Screening Program cohort study, what is the recommended management for a patient who has a positive fecal immunochemical test (FIT) following a recent colonoscopy?",
        "options": [
          "A. Offer a repeat colonoscopy.",
          "B. Wait for 10 years before the next surveillance colonoscopy.",
          "C. Perform a breath test for small intestinal bacterial overgrowth (SIBO).",
          "D. Disregard the FIT result as a false positive due to the recent colonoscopy."
        ],
        "correct": "A",
        "explanation": "The study found that a positive interval FIT is a significant marker for post-colonoscopy colorectal cancer, warranting another exam.",
        "hint": "Think about how an interval 'red flag' test should influence the clinical workflow regardless of prior screening."
      },
      {
        "question": "In the context of gastric cancer risk, what HR (hazard ratio) is associated with the daily consumption of sugary drinks?",
        "options": [
          "A. 2.45",
          "B. 1.19",
          "C. 1.00",
          "D. 4.04"
        ],
        "correct": "A",
        "explanation": "The source explicitly states that daily consumption of sugary drinks is linked to a more than double risk, specifically HR 2.45 (95% CI, 1.49-4.04).",
        "hint": "The risk is described as 'more than double' the baseline."
      },
      {
        "question": "The Global Consensus on Pregnancy and IBD highlights that varied practices and fear of fetal harm among providers are largely driven by which of the following?",
        "options": [
          "A. Limited knowledge and high reliance on local dogma",
          "B. A surplus of high-quality randomized controlled trials (RCTs)",
          "C. The universal adoption of the GRADE process across all countries",
          "D. High rates of medication adherence among pregnant patients"
        ],
        "correct": "A",
        "explanation": "The consensus identifies limited provider knowledge and individual interpretation of literature as key reasons for inconsistent care.",
        "hint": "Look for the factor that explains why different doctors might treat the same pregnancy differently."
      },
      {
        "question": "The ASGE guideline on IBD management addresses the role of endoscopy in surveillance. Which technique is specifically mentioned for the management of IBD-related complications such as strictures?",
        "options": [
          "A. Endoscopic therapy",
          "B. Prophylactic surgical bypass",
          "C. Routine capsule endoscopy in active colitis",
          "D. Total mesenteric excision"
        ],
        "correct": "A",
        "explanation": "The guideline covers the use of endoscopic therapy for managing complications like strictures in patients with Crohn's disease and UC.",
        "hint": "The question asks for a non-surgical, procedure-based intervention discussed in the guideline."
      },
      {
        "question": "Which of the following describes the study population in the six-phase 3 trial integrated safety analysis of upadacitinib?",
        "options": [
          "A. Patients with moderate-to-severe ulcerative colitis or Crohn's disease",
          "B. Pregnant women with active IBD flares",
          "C. Individuals with Lynch syndrome undergoing routine surveillance",
          "D. Healthy volunteers aged 55-64 years in Sweden"
        ],
        "correct": "A",
        "explanation": "The trials specifically included patients with moderate-to-severe presentations of these two primary forms of IBD.",
        "hint": "The study was designed to evaluate a medication used for specific levels of IBD severity."
      }
    ],
    "quizStatus": "autocontent-complete",
    "quizSourcePdfs": [
      "ibd-gi-tumors-pathology.pdf"
    ],
    "fetchedAt": "2026-09-11T00:00:00.000Z",
    "resourceStatus": "approved",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "quizGeneratedAt": "2026-09-16T00:10:00.000Z"
  },
  "colon-polyps-pathology": {
    "guidelines": [
      {
        "org": "USMSTF",
        "year": "2020",
        "month": "Mar",
        "topic": "Colorectal Polypectomy",
        "title": "Endoscopic Removal of Colorectal Lesions: Recommendations by the US Multi-Society Task Force on Colorectal Cancer",
        "summary": "Consensus recommendations covering lesion assessment, resection technique, complete excision, documentation, and post-polypectomy management principles relevant to colon-polyp pathology teaching.",
        "url": "https://pubmed.ncbi.nlm.nih.gov/32122632/",
        "status": "approved"
      },
      {
        "org": "ACG",
        "year": "2024",
        "month": "Sep",
        "topic": "CRC Screening",
        "title": "ACG Clinical Guideline: Colorectal Cancer Screening 2024 Update",
        "summary": "Reaffirms average-risk colorectal-cancer screening initiation at age 45 and frames risk stratification around adenomas and serrated lesions.",
        "url": "",
        "status": "approved"
      }
    ],
    "newsAndArticles": [
      {
        "section": "News and Articles",
        "title": "AI-assisted second look may raise right-colon adenoma detection",
        "oneLineSummary": "The added pass prolonged median total examination time from 11.7 to 13.3 minutes and may improve nonadvanced adenoma detection, but the design cannot isolate AI from the second look and did not assess interval cancers.",
        "doi": "",
        "pmid": "42633947",
        "source": "news.gastro.org",
        "sourceRepository": "weeklyArchive",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42633947/",
        "date": "Sep 18, 2026",
        "topic": "Colonoscopy and AI",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Colon Polyps Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Panel sets 10% ceiling on incomplete resection of 10-19 mm polyps",
        "oneLineSummary": "A three-round modified Delphi study reached consensus on 18 of 20 statements among 53 experts from 16 countries, recommending at least a 1-mm normal-tissue margin, deliberate defect inspection, and before-and-after photo documentation.",
        "doi": "",
        "pmid": "42624393",
        "source": "news.gastro.org",
        "sourceRepository": "weeklyArchive",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42624393/",
        "date": "Sep 16, 2026",
        "topic": "Colorectal Polypectomy Quality",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Colon Polyps Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "AI colonoscopy tool boosts adenoma detection in VA network, study finds",
        "oneLineSummary": "A cluster-randomized Veterans Health Administration study compared 42 facilities adopting GI Genius computer-aided detection with 97 controls across more than 334,000 colonoscopies.",
        "doi": "",
        "pmid": "",
        "source": "GI & Hepatology News print",
        "sourceRepository": "weeklyArchive",
        "url": "https://www.mdedge.com/gihepnews/colonoscopy",
        "date": "Sep 2026",
        "topic": "Colonoscopy and AI",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Colon Polyps Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "First-in-Human 50-Patient Robotic Colonoscopy Study Meets End Points",
        "oneLineSummary": "Cecal intubation was achieved in 100% of cases, all procedures were completed in the left lateral position without repositioning or conversion, and no major adverse events were visible in the print report; conference/early-device data should be treated as preliminary and requires",
        "doi": "",
        "pmid": "",
        "source": "Gastroenterology & Endoscopy News print",
        "sourceRepository": "weeklyArchive",
        "url": "https://www.gastroendonews.com/",
        "date": "Sep 2026",
        "topic": "Endoscopy Technology",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Colon Polyps Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "GI faces another round of Medicare cuts under proposed 2027 rules",
        "oneLineSummary": "Proposed 2027 CMS rules would cut GI payment rates and alter remote-monitoring and colonoscopy quality-measure policy, so practices should plan and advocate while awaiting final rules.",
        "doi": "",
        "pmid": "",
        "source": "news.gastro.org",
        "sourceRepository": "weeklyArchive",
        "url": "https://news.gastro.org/issues/2026/september-2026/gi-faces-another-round-of-medicare-cuts-under-proposed-2027-rules/",
        "date": "Sep 8, 2026",
        "topic": "Practice Management",
        "type": "News",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Colon Polyps Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Prevalence of intestinal spirochaetosis in serrated polyposis syndrome compared with other colorectal polyp conditions: a case-control study in Japan.",
        "oneLineSummary": "Serrated polyposis syndrome (SPS) is the most common form of colorectal polyposis syndrome. Most SPS cases are sporadic, and the environmental factors underlying its pathogenesis remain poorly defined. Source pulled from PubMed for Schedule review; human review recommended before final teaching use.",
        "doi": "10.1136/bmjgast-2026-002414",
        "pmid": "42800717",
        "source": "BMJ open gastroenterology",
        "sourceRepository": "targeted-online-pull",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42800717/",
        "date": "09 2026",
        "topic": "Colon Polyps Pathology",
        "type": "Research",
        "relevanceScore": 9,
        "relevanceReason": "Targeted online PubMed pull for Colon Polyps Pathology.",
        "status": "approved",
        "addedBy": "schedule-targeted-online-pull",
        "addedAt": "2026-10-06",
        "eventDate": "2026-10-02"
      },
      {
        "section": "News and Articles",
        "title": "Tumor-Promoting Inflammation in Serrated Colorectal Neoplasia: Immune Ecosystems and Clinical Implications.",
        "oneLineSummary": "Serrated colorectal neoplasia represents a biologically distinct route to colorectal cancer that differs from the conventional adenoma-carcinoma sequence in its molecular alterations, epithelial programs, and microenvironmental evolution. Recent studies indicate that tumor-promoting inflammation and dynamic tumor-microenvironment interactions are integral to the evolution of serrated tumors. Source pulled from PubMed for Schedule review; human review recommended before final teaching use.",
        "doi": "10.5009/gnl260271",
        "pmid": "42806646",
        "source": "Gut and liver",
        "sourceRepository": "targeted-online-pull",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42806646/",
        "date": "09 2026",
        "topic": "Colon Polyps Pathology",
        "type": "Research",
        "relevanceScore": 7,
        "relevanceReason": "Targeted online PubMed pull for Colon Polyps Pathology.",
        "status": "approved",
        "addedBy": "schedule-targeted-online-pull",
        "addedAt": "2026-10-06",
        "eventDate": "2026-10-02"
      }
    ],
    "quiz": [
      {
        "question": "Which histologic feature most strongly distinguishes a conventional adenoma from a hyperplastic polyp?",
        "options": [
          "Architectural and cytologic dysplasia",
          "Surface serration limited to the upper crypt",
          "Foamy lamina propria macrophages",
          "Prominent lymphoid aggregates"
        ],
        "correct": "A",
        "explanation": "Conventional adenomas are dysplastic epithelial lesions; hyperplastic polyps may be serrated but lack the adenomatous cytologic dysplasia that drives neoplastic risk."
      },
      {
        "question": "For a 10-19 mm nonpedunculated colorectal lesion, what quality principle is emphasized by modern polypectomy guidance?",
        "options": [
          "Aim for complete resection with a margin of normal tissue and careful defect inspection",
          "Cold biopsy forceps are preferred",
          "Tattoo directly under every lesion",
          "Avoid photo documentation"
        ],
        "correct": "A",
        "explanation": "Complete excision, inspection of the defect, and documentation are central quality steps because incomplete resection contributes to interval neoplasia."
      },
      {
        "question": "Sessile serrated lesions are clinically important because they are associated with which pathway?",
        "options": [
          "Serrated colorectal carcinogenesis, often right-sided",
          "Squamous metaplasia of the anal canal",
          "Pancreaticobiliary dysplasia",
          "Portal-hypertensive colopathy"
        ],
        "correct": "A",
        "explanation": "Sessile serrated lesions are precursor lesions in the serrated pathway and are commonly proximal/right-sided."
      },
      {
        "question": "What feature should raise concern for invasive cancer in a colorectal polyp specimen?",
        "options": [
          "Submucosal invasion",
          "Mucus cap on the surface",
          "Small size alone",
          "A left-colon location"
        ],
        "correct": "A",
        "explanation": "Submucosal invasion changes management because it raises lymph-node and residual-disease risk and may require surgical evaluation depending on adverse features."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "colon-polyps-pathology.pdf"
    ],
    "quizGeneratedAt": "2026-10-02T00:00:00.000Z",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "fetchedAt": "2026-10-01T00:00:00.000Z",
    "resourceStatus": "approved"
  },
  "appendix-and-anus-pathology": {
    "guidelines": [
      {
        "org": "ASCRS",
        "year": "2019",
        "month": "Jun",
        "topic": "Appendiceal Neoplasms",
        "title": "Clinical Practice Guidelines for the Management of Appendiceal Neoplasms",
        "summary": "Surgical-society guidance on evaluation and management of appendiceal epithelial tumors, mucinous neoplasms, and peritoneal spread; useful background for appendiceal pathology sessions.",
        "url": "https://fascrs.org/ascrs/media/files/downloads/Clinical%20Practice%20Guidelines/appendiceal_neoplasms_cpg_2019.pdf",
        "status": "approved"
      },
      {
        "org": "ASCRS",
        "year": "2018",
        "month": "Jul",
        "topic": "Anal Squamous Cell Cancer",
        "title": "Clinical Practice Guidelines for Anal Squamous Cell Cancers",
        "summary": "Guidance on diagnosis, staging, treatment, and surveillance of anal squamous neoplasia that complements anus-pathology teaching.",
        "url": "https://fascrs.org/ascrs/media/files/downloads/Clinical%20Practice%20Guidelines/anal_squamous_cell_cancers_cpg_2018.pdf",
        "status": "approved"
      }
    ],
    "newsAndArticles": [
      {
        "section": "News and Articles",
        "title": "Incomplete intestinal metaplasia progressed to gastric cancer sevenfold faster, analysis finds",
        "oneLineSummary": "Across 83 prevalence studies plus progression cohorts, incomplete intestinal metaplasia accounted for 53% of confirmed cases and progressed at 12.15 versus 1.73 gastric cancers per 1,000 person-years for complete metaplasia, while limited versus extensive disease rates did not differ significantly.",
        "doi": "",
        "pmid": "42680048",
        "source": "news.gastro.org",
        "sourceRepository": "weekly",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42680048/",
        "date": "Sep 25, 2026",
        "topic": "Gastric Intestinal Metaplasia",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Appendix and Anus Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Cancer risk comparable across advanced IBD therapies in claims analysis",
        "oneLineSummary": "Among 15,687 adults with IBD and 273 incident cancers, three-year cumulative incidence was 2.1% with TNF antagonists, 2.7% with vedolizumab, 2.0% with anti-interleukins, and 2.5% with JAK inhibitors, with no significant adjusted class difference.",
        "doi": "",
        "pmid": "42607853",
        "source": "news.gastro.org",
        "sourceRepository": "weekly",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42607853/",
        "date": "Sep 23, 2026",
        "topic": "IBD Safety",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Appendix and Anus Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Microscopic colitis risk signals reported with hormonal contraception and selected antidepressants",
        "oneLineSummary": "In DDW retrospective analyses, matched oral-contraceptive users had microscopic-colitis incidence of 1.39% versus 1.06% (RR 1.32; 95% CI, 1.22-1.43), a second cohort found 0.389% versus 0.235% (OR 1.66; P=.007), and selected antidepressants showed drug-specific associations.",
        "doi": "",
        "pmid": "",
        "source": "gastroendonews.com",
        "sourceRepository": "weekly",
        "url": "https://www.gastroendonews.com/PRN/Article/09-26/Microscopic-Colitis-Risk-With-Contraceptives-and-SSRIs-SNRIs/81540",
        "date": "Sep 21, 2026",
        "topic": "Microscopic Colitis",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Appendix and Anus Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Durable efficacy seen with neuromodulation for fecal incontinence",
        "oneLineSummary": "Severity, nerve-conduction measures, and anal squeeze pressure improved without treatment-related serious adverse events, but between-group quality-of-life benefit was not shown and long-term durability and real-world availability remain uncertain.",
        "doi": "",
        "pmid": "42105947",
        "source": "gastroendonews.com",
        "sourceRepository": "weeklyArchive",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42105947/",
        "date": "Sep 16, 2026",
        "topic": "Fecal Incontinence",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Appendix and Anus Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Global burden of cancer attributable to infections in 2024: a worldwide incidence analysis.",
        "oneLineSummary": "Infectious agents are an important preventable cause of cancer globally. To inform prevention efforts, we provide a comprehensive picture of cancer burden attributable to infections, including newly established, carcinogenic infectious agents and latest global cancer incidence estimates. Source pulled from PubMed for Schedule review; human review recommended before final teaching use.",
        "doi": "10.1016/S1470-2045(26)00307-4",
        "pmid": "42805198",
        "source": "The Lancet. Oncology",
        "sourceRepository": "targeted-online-pull",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42805198/",
        "date": "09 2026",
        "topic": "Appendix and Anus Pathology",
        "type": "Research",
        "relevanceScore": 7,
        "relevanceReason": "Targeted online PubMed pull for Appendix and Anus Pathology.",
        "status": "approved",
        "addedBy": "schedule-targeted-online-pull",
        "addedAt": "2026-10-06",
        "eventDate": "2026-10-16"
      }
    ],
    "quiz": [
      {
        "question": "A low-grade appendiceal mucinous neoplasm is most clinically concerning when associated with what finding?",
        "options": [
          "Extra-appendiceal mucin or peritoneal spread",
          "Mild acute appendicitis only",
          "A normal serosa",
          "Lymphoid hyperplasia alone"
        ],
        "correct": "A",
        "explanation": "Mucin outside the appendix, especially with epithelial cells, raises concern for peritoneal dissemination/pseudomyxoma peritonei risk."
      },
      {
        "question": "Anal squamous intraepithelial lesions are most closely linked to which risk factor?",
        "options": [
          "High-risk HPV infection",
          "Helicobacter pylori",
          "Primary sclerosing cholangitis",
          "Celiac-associated HLA type"
        ],
        "correct": "A",
        "explanation": "High-risk HPV drives most anal squamous dysplasia and carcinoma, informing screening and prevention strategies."
      },
      {
        "question": "Which anatomic distinction matters for anal pathology interpretation?",
        "options": [
          "Squamous/transitional zone versus colorectal-type mucosa",
          "Duodenal bulb versus second portion",
          "Fundic versus antral mucosa",
          "Intrahepatic versus extrahepatic bile duct"
        ],
        "correct": "A",
        "explanation": "The anal canal includes squamous, transitional, and glandular mucosa; lesion type and differential diagnosis depend on location."
      },
      {
        "question": "For appendiceal neuroendocrine tumors, what commonly influences management beyond diagnosis alone?",
        "options": [
          "Tumor size, margin status, mesoappendiceal invasion, and grade",
          "Serum amylase only",
          "Presence of diverticulosis",
          "Colonoscopy withdrawal time"
        ],
        "correct": "A",
        "explanation": "Risk stratification uses size and pathologic adverse features to decide whether appendectomy alone is adequate or additional surgery is considered."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "appendix-and-anus-pathology.pdf"
    ],
    "quizGeneratedAt": "2026-10-02T00:00:00.000Z",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "fetchedAt": "2026-10-01T00:00:00.000Z",
    "resourceStatus": "approved"
  },
  "celiac-disease": {
    "guidelines": [
      {
        "org": "ACG",
        "year": "2023",
        "month": "Jan",
        "topic": "Celiac Disease",
        "title": "ACG Clinical Guidelines: Diagnosis and Management of Celiac Disease",
        "summary": "Evidence-based guidance on serologic testing, duodenal biopsy, gluten-free diet management, monitoring, refractory celiac disease, and special populations.",
        "url": "https://pubmed.ncbi.nlm.nih.gov/36602836/",
        "status": "approved"
      }
    ],
    "newsAndArticles": [
      {
        "section": "News and Articles",
        "title": "Celiac disease linked to higher liver-transplant risk in Swedish cohort",
        "oneLineSummary": "Swedish nationwide matched cohort, 2000-2023; Biopsy-proven celiac disease and matched comparators; 41,277 and 196,863; mean follow-up 12.1 years.",
        "doi": "",
        "pmid": "42214801",
        "source": "gastroendonews.com",
        "sourceRepository": "weeklyArchive",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42214801/",
        "date": "Sep 10, 2026",
        "topic": "Celiac Disease",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Celiac Disease.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Celiac care nears a turning point in screening and treatment, expert says",
        "oneLineSummary": "Expert news report from a Society for the Study of Celiac Disease/Celiac Disease Foundation policy symposium describes a transition toward broader screening and therapies beyond strict gluten avoidance.",
        "doi": "",
        "pmid": "",
        "source": "GI & Hepatology News",
        "sourceRepository": "weeklyArchive",
        "url": "https://news.gastro.org/issues/2026/june-2026/celiac-care-nears-a-turning-point-in-screening-and-treatment-expert-says/",
        "date": "Jun 26, 2026",
        "topic": "Celiac Disease",
        "type": "News",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Celiac Disease.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Celiac Disease.",
        "oneLineSummary": "Recent NEJM review article identified through PubMed for the October celiac disease lecture; human review recommended before teaching use.",
        "doi": "",
        "pmid": "41950475",
        "source": "New England Journal of Medicine",
        "sourceRepository": "targeted-pubmed-pull",
        "url": "https://pubmed.ncbi.nlm.nih.gov/41950475/",
        "date": "Apr 2026",
        "topic": "Celiac Disease",
        "type": "Review",
        "relevanceScore": 10,
        "relevanceReason": "Targeted PubMed pull for Celiac Disease.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      }
    ],
    "quiz": [
      {
        "question": "Which initial serologic test is most commonly used for suspected celiac disease in an IgA-sufficient patient?",
        "options": [
          "Tissue transglutaminase IgA",
          "Anti-mitochondrial antibody",
          "p-ANCA",
          "Serum gastrin"
        ],
        "correct": "A",
        "explanation": "tTG-IgA is the usual first-line test, paired with total IgA to avoid missing IgA deficiency."
      },
      {
        "question": "What diet state is preferred when performing diagnostic serology or duodenal biopsy for celiac disease?",
        "options": [
          "Eating gluten",
          "Strict gluten avoidance for 6 months",
          "Elemental diet",
          "Low-FODMAP diet"
        ],
        "correct": "A",
        "explanation": "Testing is most reliable while the patient is consuming gluten; gluten avoidance can normalize serology and histology."
      },
      {
        "question": "Classic untreated celiac disease histology includes which pattern?",
        "options": [
          "Villous atrophy with increased intraepithelial lymphocytes",
          "Crypt abscesses with transmural granulomas",
          "Pseudomembranes",
          "Eosinophilic microabscesses only"
        ],
        "correct": "A",
        "explanation": "Celiac disease typically shows increased intraepithelial lymphocytes, crypt hyperplasia, and varying villous atrophy."
      },
      {
        "question": "A key long-term management step after diagnosis is:",
        "options": [
          "Dietitian-supported gluten-free diet and follow-up for response/adherence",
          "Empiric colectomy",
          "Chronic broad-spectrum antibiotics",
          "Avoid all dietary fat"
        ],
        "correct": "A",
        "explanation": "Management centers on a strict gluten-free diet, nutritional assessment, and follow-up of symptoms and serologic response."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "celiac-disease.pdf"
    ],
    "quizGeneratedAt": "2026-10-02T00:00:00.000Z",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "fetchedAt": "2026-10-01T00:00:00.000Z",
    "resourceStatus": "approved"
  },
  "small-intestine-pathology": {
    "guidelines": [
      {
        "org": "ACG",
        "year": "2015",
        "month": "Sep",
        "topic": "Small Bowel Bleeding",
        "title": "ACG Clinical Guideline: Diagnosis and Management of Small Bowel Bleeding",
        "summary": "Guidance on capsule endoscopy, deep enteroscopy, imaging, and management of suspected small-bowel bleeding lesions, with relevance to small-intestine pathology correlation.",
        "url": "https://pubmed.ncbi.nlm.nih.gov/26303132/",
        "status": "approved"
      },
      {
        "org": "ACG",
        "year": "2023",
        "month": "Jan",
        "topic": "Celiac Disease",
        "title": "ACG Clinical Guidelines: Diagnosis and Management of Celiac Disease",
        "summary": "Celiac disease remains a key small-intestinal pathology topic; this guideline covers diagnostic histology, serology, follow-up, and refractory disease.",
        "url": "https://pubmed.ncbi.nlm.nih.gov/36602836/",
        "status": "approved"
      }
    ],
    "newsAndArticles": [
      {
        "section": "News and Articles",
        "title": "Celiac disease linked to higher liver-transplant risk in Swedish cohort",
        "oneLineSummary": "Swedish nationwide matched cohort, 2000-2023; Biopsy-proven celiac disease and matched comparators; 41,277 and 196,863; mean follow-up 12.1 years.",
        "doi": "",
        "pmid": "42214801",
        "source": "gastroendonews.com",
        "sourceRepository": "weeklyArchive",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42214801/",
        "date": "Sep 10, 2026",
        "topic": "Celiac Disease",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Small Intestine Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Celiac care nears a turning point in screening and treatment, expert says",
        "oneLineSummary": "Expert news report from a Society for the Study of Celiac Disease/Celiac Disease Foundation policy symposium describes a transition toward broader screening and therapies beyond strict gluten avoidance.",
        "doi": "",
        "pmid": "",
        "source": "GI & Hepatology News",
        "sourceRepository": "weeklyArchive",
        "url": "https://news.gastro.org/issues/2026/june-2026/celiac-care-nears-a-turning-point-in-screening-and-treatment-expert-says/",
        "date": "Jun 26, 2026",
        "topic": "Celiac Disease",
        "type": "News",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Small Intestine Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Coeliac disease.",
        "oneLineSummary": "Lancet seminar/review identified through PubMed for small-intestine pathology context; human review recommended before teaching use.",
        "doi": "",
        "pmid": "35691302",
        "source": "Lancet",
        "sourceRepository": "targeted-pubmed-pull",
        "url": "https://pubmed.ncbi.nlm.nih.gov/35691302/",
        "date": "Jun 2022",
        "topic": "Small Intestine Pathology",
        "type": "Review",
        "relevanceScore": 8,
        "relevanceReason": "Targeted PubMed pull for Small Intestine Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      }
    ],
    "quiz": [
      {
        "question": "For suspected small-bowel bleeding after negative EGD and colonoscopy, what test is often used early?",
        "options": [
          "Video capsule endoscopy",
          "Barium swallow only",
          "Routine ERCP",
          "Hydrogen breath test as first-line bleeding evaluation"
        ],
        "correct": "A",
        "explanation": "Capsule endoscopy is commonly used to evaluate mucosal small-bowel bleeding sources after standard endoscopy is unrevealing."
      },
      {
        "question": "Which lesion is a common small-bowel bleeding source in older adults?",
        "options": [
          "Angioectasia",
          "Barrett's esophagus",
          "Fundic gland polyp",
          "Anal fissure"
        ],
        "correct": "A",
        "explanation": "Small-bowel angioectasias are frequent causes of obscure/small-bowel bleeding, especially in older patients."
      },
      {
        "question": "Which small-intestinal pathology pattern is typical for celiac disease?",
        "options": [
          "Villous blunting with intraepithelial lymphocytosis",
          "Caseating granulomas only",
          "Goblet-cell loss limited to rectum",
          "Mallory-Denk bodies"
        ],
        "correct": "A",
        "explanation": "Celiac disease is a prototypical small-bowel mucosal disorder with villous blunting and increased intraepithelial lymphocytes."
      },
      {
        "question": "When capsule endoscopy identifies a treatable small-bowel lesion, what procedure may allow therapy or biopsy?",
        "options": [
          "Device-assisted enteroscopy",
          "Flexible sigmoidoscopy only",
          "Transjugular liver biopsy",
          "Endoscopic ultrasound of the pancreas"
        ],
        "correct": "A",
        "explanation": "Deep/device-assisted enteroscopy can reach small-bowel lesions for therapy, biopsy, or tattooing after capsule localization."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "small-intestine-pathology.pdf"
    ],
    "quizGeneratedAt": "2026-10-02T00:00:00.000Z",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "fetchedAt": "2026-10-01T00:00:00.000Z",
    "resourceStatus": "approved"
  },
  "ai-in-gi-research": {
    "guidelines": [
      {
        "org": "AGA/CGH",
        "year": "2026",
        "month": "Mar",
        "topic": "AI in GI Research",
        "title": "Artificial Intelligence Tools for Gastrointestinal Research: A Practical Guide",
        "summary": "Practical AGA-journal guide for using AI tools in GI research, including verification, privacy, disclosure, study design, and risk-tiered use cases.",
        "url": "https://doi.org/10.1016/j.cgh.2026.03.032",
        "status": "approved"
      }
    ],
    "newsAndArticles": [
      {
        "section": "News and Articles",
        "title": "Artificial Intelligence Tools for Gastrointestinal Research: A Practical Guide",
        "oneLineSummary": "CGH practical guide covering AI tools for GI research workflows, source verification, disclosure, privacy, and risk-tiered use.",
        "doi": "10.1016/j.cgh.2026.03.032",
        "pmid": "",
        "source": "Clinical Gastroenterology and Hepatology",
        "sourceRepository": "local-pdf-library",
        "url": "https://doi.org/10.1016/j.cgh.2026.03.032",
        "date": "2026",
        "topic": "AI in GI Research",
        "type": "Review",
        "relevanceScore": 12,
        "relevanceReason": "Previously retrieved local PDF for Ali; exact match for AI in GI research lecture.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "AI-assisted second look may raise right-colon adenoma detection",
        "oneLineSummary": "The added pass prolonged median total examination time from 11.7 to 13.3 minutes and may improve nonadvanced adenoma detection, but the design cannot isolate AI from the second look and did not assess interval cancers.",
        "doi": "",
        "pmid": "42633947",
        "source": "news.gastro.org",
        "sourceRepository": "weeklyArchive",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42633947/",
        "date": "Sep 18, 2026",
        "topic": "Colonoscopy and AI",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: AI in GI Research.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "AI colonoscopy tool boosts adenoma detection in VA network, study finds",
        "oneLineSummary": "A cluster-randomized Veterans Health Administration study compared 42 facilities adopting GI Genius computer-aided detection with 97 controls across more than 334,000 colonoscopies.",
        "doi": "",
        "pmid": "",
        "source": "GI & Hepatology News print",
        "sourceRepository": "weeklyArchive",
        "url": "https://www.mdedge.com/gihepnews/colonoscopy",
        "date": "Sep 2026",
        "topic": "Colonoscopy and AI",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: AI in GI Research.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "AI's deskilling question has a GI metric: ADR",
        "oneLineSummary": "Opinion anchored by a 2025 multicenter observational before-and-after study; Unassisted diagnostic colonoscopies at four Polish centers; 1,443 (795 before, 648 after CADe exposure).",
        "doi": "",
        "pmid": "",
        "source": "news.gastro.org",
        "sourceRepository": "weeklyArchive",
        "url": "https://www.thelancet.com/journals/langas/article/PIIS2468-1253(25)00133-5/abstract",
        "date": "Sep 11, 2026",
        "topic": "Endoscopy and AI",
        "type": "Opinion",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: AI in GI Research.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "The yield of artificial intelligence (GI genius) in Lynch syndrome -A randomized tandem-colonoscopy trial.",
        "oneLineSummary": "Artificial intelligence (AI)- assisted colonoscopy has been shown to increase the adenoma-detection rate in the general population but there is a paucity of data on its benefit in Lynch syndrome. We aimed to investigate the incremental detection rate of polyps using AI- assisted colonoscopy compared with high-definition white-light endoscopy (HD-WLE). Source pulled from PubMed for Schedule review; human review recommended before final teaching use.",
        "doi": "10.1016/j.dld.2026.08.020",
        "pmid": "42744673",
        "source": "Digestive and liver disease : official journal of the Italian Society of Gastroenterology and the Italian Association for the Study of the Liver",
        "sourceRepository": "targeted-online-pull",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42744673/",
        "date": "09 2026",
        "topic": "AI in GI Research",
        "type": "Research",
        "relevanceScore": 7,
        "relevanceReason": "Targeted online PubMed pull for AI in GI Research.",
        "status": "approved",
        "addedBy": "schedule-targeted-online-pull",
        "addedAt": "2026-10-06",
        "eventDate": "2026-10-27"
      }
    ],
    "quiz": [
      {
        "question": "Before using an AI tool for GI research writing or analysis, what is a key safety step?",
        "options": [
          "Verify outputs against primary sources and disclose AI assistance when appropriate",
          "Assume all citations are correct",
          "Upload identifiable patient data to public tools",
          "Skip human review"
        ],
        "correct": "A",
        "explanation": "AI outputs can be wrong or fabricated; verification, privacy protection, and disclosure are core safeguards."
      },
      {
        "question": "Which project is highest risk for unrestricted public-AI use?",
        "options": [
          "A dataset containing protected health information",
          "A public PubMed search strategy",
          "A de-identified teaching outline",
          "A generic grammar edit"
        ],
        "correct": "A",
        "explanation": "PHI and sensitive unpublished data require institution-approved, secure workflows rather than open public tools."
      },
      {
        "question": "In AI-assisted literature review, what should remain human-controlled?",
        "options": [
          "Final inclusion decisions and interpretation of clinical relevance",
          "Only font choice",
          "Nothing once prompts are written",
          "The browser zoom level"
        ],
        "correct": "A",
        "explanation": "AI can help screen and organize, but investigators must make and document final evidence judgments."
      },
      {
        "question": "A practical way to reduce hallucinated references is to:",
        "options": [
          "Use source-grounded retrieval and check every citation/DOI",
          "Ask for more confident wording",
          "Remove citations",
          "Use only longer prompts"
        ],
        "correct": "A",
        "explanation": "Grounding outputs in retrieved sources and verifying citations helps prevent fabricated or mismatched references."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "ai-in-gi-research.pdf"
    ],
    "quizGeneratedAt": "2026-10-02T00:00:00.000Z",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "fetchedAt": "2026-10-01T00:00:00.000Z",
    "resourceStatus": "approved"
  },
  "colon-pathology": {
    "guidelines": [
      {
        "org": "ACG",
        "year": "2024",
        "month": "Sep",
        "topic": "CRC Screening",
        "title": "ACG Clinical Guideline: Colorectal Cancer Screening 2024 Update",
        "summary": "Screening and surveillance principles connect colon pathology findings with prevention, risk stratification, and follow-up intervals.",
        "url": "",
        "status": "approved"
      },
      {
        "org": "USMSTF",
        "year": "2020",
        "month": "Mar",
        "topic": "Colorectal Polypectomy",
        "title": "Endoscopic Removal of Colorectal Lesions: Recommendations by the US Multi-Society Task Force on Colorectal Cancer",
        "summary": "Provides practical recommendations for recognition and complete removal of colorectal lesions, relevant to interpreting colon pathology and resection quality.",
        "url": "https://pubmed.ncbi.nlm.nih.gov/32122632/",
        "status": "approved"
      }
    ],
    "newsAndArticles": [
      {
        "section": "News and Articles",
        "title": "AI-assisted second look may raise right-colon adenoma detection",
        "oneLineSummary": "The added pass prolonged median total examination time from 11.7 to 13.3 minutes and may improve nonadvanced adenoma detection, but the design cannot isolate AI from the second look and did not assess interval cancers.",
        "doi": "",
        "pmid": "42633947",
        "source": "news.gastro.org",
        "sourceRepository": "weeklyArchive",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42633947/",
        "date": "Sep 18, 2026",
        "topic": "Colonoscopy and AI",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Colon Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Panel sets 10% ceiling on incomplete resection of 10-19 mm polyps",
        "oneLineSummary": "A three-round modified Delphi study reached consensus on 18 of 20 statements among 53 experts from 16 countries, recommending at least a 1-mm normal-tissue margin, deliberate defect inspection, and before-and-after photo documentation.",
        "doi": "",
        "pmid": "42624393",
        "source": "news.gastro.org",
        "sourceRepository": "weeklyArchive",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42624393/",
        "date": "Sep 16, 2026",
        "topic": "Colorectal Polypectomy Quality",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Colon Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "AI colonoscopy tool boosts adenoma detection in VA network, study finds",
        "oneLineSummary": "A cluster-randomized Veterans Health Administration study compared 42 facilities adopting GI Genius computer-aided detection with 97 controls across more than 334,000 colonoscopies.",
        "doi": "",
        "pmid": "",
        "source": "GI & Hepatology News print",
        "sourceRepository": "weeklyArchive",
        "url": "https://www.mdedge.com/gihepnews/colonoscopy",
        "date": "Sep 2026",
        "topic": "Colonoscopy and AI",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Colon Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "First-in-Human 50-Patient Robotic Colonoscopy Study Meets End Points",
        "oneLineSummary": "Cecal intubation was achieved in 100% of cases, all procedures were completed in the left lateral position without repositioning or conversion, and no major adverse events were visible in the print report; conference/early-device data should be treated as preliminary and requires",
        "doi": "",
        "pmid": "",
        "source": "Gastroenterology & Endoscopy News print",
        "sourceRepository": "weeklyArchive",
        "url": "https://www.gastroendonews.com/",
        "date": "Sep 2026",
        "topic": "Endoscopy Technology",
        "type": "Research",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Colon Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "AI's deskilling question has a GI metric: ADR",
        "oneLineSummary": "Opinion anchored by a 2025 multicenter observational before-and-after study; Unassisted diagnostic colonoscopies at four Polish centers; 1,443 (795 before, 648 after CADe exposure).",
        "doi": "",
        "pmid": "",
        "source": "news.gastro.org",
        "sourceRepository": "weeklyArchive",
        "url": "https://www.thelancet.com/journals/langas/article/PIIS2468-1253(25)00133-5/abstract",
        "date": "Sep 11, 2026",
        "topic": "Endoscopy and AI",
        "type": "Opinion",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Colon Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "GI faces another round of Medicare cuts under proposed 2027 rules",
        "oneLineSummary": "Proposed 2027 CMS rules would cut GI payment rates and alter remote-monitoring and colonoscopy quality-measure policy, so practices should plan and advocate while awaiting final rules.",
        "doi": "",
        "pmid": "",
        "source": "news.gastro.org",
        "sourceRepository": "weeklyArchive",
        "url": "https://news.gastro.org/issues/2026/september-2026/gi-faces-another-round-of-medicare-cuts-under-proposed-2027-rules/",
        "date": "Sep 8, 2026",
        "topic": "Practice Management",
        "type": "News",
        "relevanceScore": 8,
        "relevanceReason": "Matched October schedule topic: Colon Pathology.",
        "status": "candidate",
        "addedBy": "october-schedule-image-import",
        "addedAt": "2026-10-01"
      },
      {
        "section": "News and Articles",
        "title": "Anatomical Distribution and Prevalence of Dysplasia in Sessile Serrated Lesions: A Cohort Study Over Seven Years.",
        "oneLineSummary": "Sessile serrated lesions (SSLs) progress to colorectal cancer via a critical intermediary stage, SSL with dysplasia (SSLd). Data on the anatomical distribution of SSLd are limited, particularly in high-detection-rate settings. Source pulled from PubMed for Schedule review; human review recommended before final teaching use.",
        "doi": "10.1016/j.gastha.2026.101079",
        "pmid": "42733487",
        "source": "Gastro hep advances",
        "sourceRepository": "targeted-online-pull",
        "url": "https://pubmed.ncbi.nlm.nih.gov/42733487/",
        "date": "09 2026",
        "topic": "Colon Pathology",
        "type": "Research",
        "relevanceScore": 9,
        "relevanceReason": "Targeted online PubMed pull for Colon Pathology.",
        "status": "approved",
        "addedBy": "schedule-targeted-online-pull",
        "addedAt": "2026-10-06",
        "eventDate": "2026-10-30"
      }
    ],
    "quiz": [
      {
        "question": "Which finding defines invasive colorectal adenocarcinoma in a polyp?",
        "options": [
          "Invasion through muscularis mucosae into submucosa",
          "Low-grade dysplasia confined to mucosa",
          "A serrated surface",
          "A mucus cap"
        ],
        "correct": "A",
        "explanation": "Submucosal invasion distinguishes invasive carcinoma from intramucosal dysplasia in colorectal lesions."
      },
      {
        "question": "Lynch syndrome screening of colorectal cancer tissue commonly uses:",
        "options": [
          "Mismatch-repair immunohistochemistry or MSI testing",
          "Serum lipase",
          "H. pylori stool antigen",
          "Fecal elastase"
        ],
        "correct": "A",
        "explanation": "MMR IHC/MSI testing identifies tumors that may indicate Lynch syndrome and guides genetic evaluation and immunotherapy relevance."
      },
      {
        "question": "Which pathology result most directly affects post-polypectomy surveillance intervals?",
        "options": [
          "Number, size, histology, and dysplasia of adenomas/serrated lesions",
          "Patient shoe size",
          "Sedation medication",
          "Room temperature"
        ],
        "correct": "A",
        "explanation": "Surveillance recommendations depend on polyp burden and risk features such as size, villous histology, high-grade dysplasia, and serrated-lesion features."
      },
      {
        "question": "Poor differentiation, lymphovascular invasion, and positive margin in a malignant polyp generally imply:",
        "options": [
          "Higher risk features that may prompt surgical evaluation",
          "No need for follow-up",
          "Benign hyperplastic change",
          "Celiac disease"
        ],
        "correct": "A",
        "explanation": "Adverse histologic features increase the risk of residual disease or nodal metastasis and may alter management."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "colon-pathology.pdf"
    ],
    "quizGeneratedAt": "2026-10-02T00:00:00.000Z",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "fetchedAt": "2026-10-01T00:00:00.000Z",
    "resourceStatus": "approved"
  }
};

export default scheduleResources;
