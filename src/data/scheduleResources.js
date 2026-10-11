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
          "B. Bismuth quadruple therapy (BQT) for 7 days",
          "C. Clarithromycin triple therapy for 10 days",
          "D. Levofloxacin triple therapy for 14 days"
        ],
        "correct": "A",
        "explanation": "Current guidelines prioritize 14-day bismuth quadruple therapy as the preferred empiric choice when susceptibility data are unavailable.",
        "hint": "Consider the regimen that addresses rising resistance rates by using four different agents for a full two-week course."
      },
      {
        "question": "A patient is found to have incidental Gastric Intestinal Metaplasia (GIM) during an upper endoscopy for reflux. According to the AGA clinical practice guidelines, what is the next most appropriate management step?",
        "options": [
          "A. Scheduling a surveillance endoscopy in 1 year",
          "B. Initiating high-dose PPI therapy and repeat biopsy in 6 months",
          "C. Immediate referral for endoscopic submucosal dissection",
          "D. Testing for and eradication of H. pylori"
        ],
        "correct": "D",
        "explanation": "The AGA guideline strongly recommends H. pylori testing and treatment in patients with GIM to reduce the risk of progression.",
        "hint": "The guideline focuses on addressing the primary treatable risk factor associated with the development of metaplasia."
      },
      {
        "question": "In a patient who has already failed an 'optimized' 14-day bismuth quadruple therapy (BQT) for H. pylori, what is the preferred empiric alternative salvage regimen according to the 2024 ACG guidelines?",
        "options": [
          "A. Levofloxacin quadruple therapy for 14 days",
          "B. Standard clarithromycin triple therapy for 14 days",
          "C. Sequential therapy for 10 days",
          "D. Rifabutin triple therapy for 14 days"
        ],
        "correct": "D",
        "explanation": "Rifabutin triple therapy is recommended as a suitable empiric salvage option for patients who have already failed an optimized BQT.",
        "hint": "Identify the antibiotic that is frequently used in multi-drug resistant cases and does not share resistance pathways with clarithromycin."
      },
      {
        "question": "A recent meta-analysis of global H. pylori prevalence between 1980 and 2022 found that while adult prevalence has significantly declined, which demographic has not seen a significant reduction in infection rates?",
        "options": [
          "A. Adults in the Western Pacific region",
          "B. Females in the African region",
          "C. Children and adolescents",
          "D. Adults in the Southeast Asian region"
        ],
        "correct": "C",
        "explanation": "The study highlights that while adult prevalence dropped from 52.6% to 43.9%, prevalence in children remained high at 35.1% without significant decline.",
        "hint": "Look for the younger age group where public health measures have yet to show a statistical impact on infection trends."
      },
      {
        "question": "In the pragmatic randomized clinical trial conducted in Taiwan, how did the invitation for H. pylori stool antigen (HPSA) + FIT assessment affect gastric cancer incidence compared to FIT alone in the primary analysis?",
        "options": [
          "A. There was no significant difference in gastric cancer incidence rates.",
          "B. It significantly reduced gastric cancer mortality but not incidence.",
          "C. It increased gastric cancer incidence due to over-diagnosis.",
          "D. It significantly reduced both incidence and mortality."
        ],
        "correct": "A",
        "explanation": "In the initial analysis of the invited individuals, incidence rates were 0.032% vs 0.037%, which was not statistically significant (P = .23).",
        "hint": "Distinguish between the raw primary outcomes and the 'post hoc' analyses that adjusted for participation rates."
      },
      {
        "question": "Recent evidence published regarding dietary habits suggests that the daily consumption of sugary drinks is associated with what level of risk for developing gastric cancer?",
        "options": [
          "A. No significant association with gastric cancer",
          "B. More than double the risk (HR 2.45)",
          "C. A fourfold increase in risk (HR 4.04)",
          "D. A slight increase in risk (HR 1.25)"
        ],
        "correct": "B",
        "explanation": "Daily consumption of sugary drinks was linked to a Hazard Ratio of 2.45, indicating a more than twofold increase in risk.",
        "hint": "The reported Hazard Ratio falls between 2 and 3."
      },
      {
        "question": "For a treatment-naive patient with H. pylori infection who does NOT have a penicillin allergy, which of the following is considered a suitable empiric alternative to bismuth quadruple therapy?",
        "options": [
          "A. Metronidazole-based triple therapy for 7 days",
          "B. Potassium-competitive acid blocker (P-CAB) dual therapy for 14 days",
          "C. High-dose PPI monotherapy for 28 days",
          "D. Doxycycline-based quadruple therapy for 10 days"
        ],
        "correct": "B",
        "explanation": "P-CAB dual therapy for 14 days is recognized as a suitable empiric alternative in patients without a penicillin allergy.",
        "hint": "This alternative uses a newer class of acid suppressants combined with only one antibiotic."
      },
      {
        "question": "In the Taiwan H. pylori screening trial, what was the eradication rate among those participants who tested positive for the stool antigen and received antibiotic treatment?",
        "options": [
          "A. 71.4%",
          "B. 49.6%",
          "C. 38.5%",
          "D. 91.9%"
        ],
        "correct": "D",
        "explanation": "Of the participants who received antibiotics in the HPSA + FIT group, 91.9% successfully achieved eradication.",
        "hint": "The correct figure represents a high level of success for the therapeutic intervention phase of the trial."
      },
      {
        "question": "According to the ACG clinical guideline, when is it appropriate to use salvage regimens containing clarithromycin or levofloxacin for persistent H. pylori infection?",
        "options": [
          "A. Whenever bismuth quadruple therapy has failed twice",
          "B. As the standard empiric second-line choice in North America",
          "C. Only in patients with a documented penicillin allergy",
          "D. Only if antibiotic susceptibility is confirmed"
        ],
        "correct": "D",
        "explanation": "Due to high resistance rates, these specific antibiotics should not be used empiricially in salvage therapy without sensitivity testing.",
        "hint": "Think about the role of antimicrobial stewardship and the impact of pre-existing resistance on treatment failure."
      },
      {
        "question": "The AGA guidelines on Gastric Intestinal Metaplasia (GIM) apply specifically to which of the following clinical scenarios?",
        "options": [
          "A. Pediatric patients with a family history of gastric cancer",
          "B. Patients with known hereditary diffuse gastric cancer syndromes",
          "C. Adults with GIM identified incidentally on upper endoscopy",
          "D. Patients presenting with hematemesis and visible gastric ulcers"
        ],
        "correct": "C",
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
          "A. It eliminated the need for any subsequent endoscopic procedures for one year.",
          "B. It was only effective in patients with a baseline requirement of more than 20 RBC units.",
          "C. It significantly reduced the mean number of transfusion units compared to standard care.",
          "D. It significantly improved 1-year survival rates compared to endoscopic therapy alone."
        ],
        "correct": "C",
        "explanation": "The study demonstrated a mean reduction of 10.2 transfusion units in the octreotide group compared to the standard of care group.",
        "hint": "Focus on the primary outcome measure related to the total number of red blood cell and iron supplements needed."
      },
      {
        "question": "According to the 2024 randomized controlled trial published in Hepatology, how did tranexamic acid (TXA) affect patients with advanced cirrhosis (Child-Turcotte-Pugh B or C) presenting with UGIB?",
        "options": [
          "A. It significantly reduced the 5-day and 6-week mortality rates.",
          "B. It increased the risk of systemic fibrinolysis and subsequent thromboembolic events.",
          "C. It reduced failure to control bleeding by day 5, specifically by preventing bleeding from EVL sites.",
          "D. It was only effective in patients with Child-Turcotte-Pugh class A cirrhosis."
        ],
        "correct": "C",
        "explanation": "TXA was found to significantly lower 5-day treatment failure, largely attributed to its effect on esophageal endoscopic variceal ligation sites.",
        "hint": "Consider the impact on short-term bleeding control versus long-term survival."
      },
      {
        "question": "Which pre-endoscopic pharmacologic intervention is recommended in recent reviews to improve visibility during an endoscopy for acute upper gastrointestinal bleeding (UGIB)?",
        "options": [
          "A. Erythromycin",
          "B. Activated charcoal",
          "C. Tranexamic acid",
          "D. High-dose Vitamin K"
        ],
        "correct": "A",
        "explanation": "Erythromycin is a prokinetic agent used pre-endoscopically to clear the stomach of blood and clots, thereby improving the diagnostic yield.",
        "hint": "This medication is used for its prokinetic properties rather than its effect on coagulation."
      },
      {
        "question": "Based on AASLD practice guidance, which procedure is emphasized for the management of esophageal, gastric, and ectopic variceal hemorrhage when medical/endoscopic therapy is insufficient?",
        "options": [
          "A. Routine balloon tamponade for all patients",
          "B. Surgical portacaval shunt",
          "C. Splenectomy",
          "D. Transjugular intrahepatic portosystemic shunt (TIPS)"
        ],
        "correct": "D",
        "explanation": "TIPS is a well-established intervention for treating the complications of portal hypertension, including refractory variceal bleeding.",
        "hint": "Think of a percutaneous vascular procedure that creates a low-resistance channel between the portal and systemic circulation."
      },
      {
        "question": "For a patient with peptic ulcer disease (PUD) exhibiting high-risk stigmata, which endoscopic therapy is recommended by current evidence-based management reviews?",
        "options": [
          "A. Over-the-scope clips (OTSCs) and TC-325 powder spray",
          "B. Argon Plasma Coagulation (APC) as the sole therapy",
          "C. Epinephrine injection alone",
          "D. Barium coating of the ulcer bed"
        ],
        "correct": "A",
        "explanation": "Modern endoscopic management for high-risk PUD includes these advanced mechanical and topical hemostatic agents.",
        "hint": "Look for a combination involving a mechanical clipping device and a hemostatic powder."
      },
      {
        "question": "What is the recommended restrictive red blood cell (RBC) transfusion threshold for most patients with UGIB, provided they do not have significant cardiovascular disease?",
        "options": [
          "A. Hematocrit < 35%",
          "B. Hemoglobin < 7 g/dL",
          "C. Hemoglobin < 12 g/dL",
          "D. Hemoglobin < 10 g/dL"
        ],
        "correct": "B",
        "explanation": "A restrictive transfusion policy, typically using a threshold of 7 g/dL, is recommended to improve outcomes in UGIB.",
        "hint": "The strategy involves waiting until the oxygen-carrying capacity is significantly low to avoid volume overload and portal pressure spikes."
      },
      {
        "question": "In the context of post-endoscopic management, how should suspected rebleeding in a high-risk PUD patient initially be managed?",
        "options": [
          "A. Repeat endoscopy",
          "B. Emergency surgical gastrectomy",
          "C. Increasing the IV PPI dose without further visualization",
          "D. Immediate referral for arterial embolization"
        ],
        "correct": "A",
        "explanation": "Current management reviews suggest that rebleeding in high-risk PUD should initially be evaluated with a repeat endoscopic look.",
        "hint": "The first step for recurrent bleeding is usually the same modality used for the initial diagnosis."
      },
      {
        "question": "Which of the following describes the ASGE's approach to creating guidelines like the one for non-variceal upper GI bleeding?",
        "options": [
          "A. Recommendations are based strictly on expert opinion without literature review.",
          "B. Guidelines serve as a legally binding substitute for a physician's individual opinion.",
          "C. Guidelines are updated every 10 years regardless of new evidence.",
          "D. They use the GRADE methodology to assess the quality of evidence and strength of recommendations."
        ],
        "correct": "D",
        "explanation": "The ASGE utilizes the Grading of Recommendation Assessment, Development and Evaluation (GRADE) framework for its evidence-based guidelines.",
        "hint": "Recall the acronym for the standard system used to rate the certainty of evidence in clinical practice guidelines."
      },
      {
        "question": "Regarding patients with cirrhosis and UGIB, what additional pre-endoscopic therapies are recommended beyond standard PPI and prokinetics?",
        "options": [
          "A. Oral anticoagulation to prevent portal vein thrombosis",
          "B. High-volume saline resuscitation to reach a Hemoglobin of 12 g/dL",
          "C. Prophylactic antibiotics and vasoactive medications",
          "D. Routine placement of a Nasogastric (NG) tube for gastric lavage"
        ],
        "correct": "C",
        "explanation": "These interventions are critical in cirrhotics to reduce the risk of infection and lower portal pressure during an acute bleed.",
        "hint": "Think about the specific complications of liver disease, such as spontaneous bacterial peritonitis and elevated portal pressures."
      },
      {
        "question": "What did the 1995 NIH conference conclude regarding the use of TIPS compared to medical or surgical therapy?",
        "options": [
          "A. TIPS was ineffective for acute control of variceal bleeding.",
          "B. TIPS was definitively superior to large volume paracentesis for all forms of ascites.",
          "C. Surgical shunts were recommended over TIPS for all portal hypertension complications.",
          "D. It was unclear exactly when TIPS should be used relative to other therapies."
        ],
        "correct": "D",
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
          "A. Any patient with a serum lipase level greater than three times the normal limit",
          "B. Only patients who have already undergone a cholecystectomy",
          "C. Cases of biliary pancreatitis complicated by cholangitis",
          "D. All patients with suspected gallstone-induced pancreatitis to prevent recurrence"
        ],
        "correct": "C",
        "explanation": "Clinical guidelines specify that early ERCP is necessary when biliary pancreatitis is complicated by an infection of the bile duct.",
        "hint": "Consider the specific clinical complication that often requires urgent biliary decompression."
      },
      {
        "question": "In the Danish multicenter randomized controlled trial regarding methylnaltrexone in acute pancreatitis, what was the primary finding concerning the Pancreatitis Activity Scoring System (PASS) score at 48 hours?",
        "options": [
          "A. There was no significant difference in the PASS score between the groups",
          "B. Methylnaltrexone significantly reduced the PASS score compared to placebo",
          "C. The PASS score was only reduced in patients with existing opioid-induced constipation",
          "D. The PASS score was significantly higher in the methylnaltrexone group, suggesting harm"
        ],
        "correct": "A",
        "explanation": "The trial concluded that methylnaltrexone treatment did not achieve superiority over placebo for reducing disease severity.",
        "hint": "Think about whether the peripherally acting \\mu-opioid receptor antagonist successfully altered the trajectory of the disease."
      },
      {
        "question": "A prospective cohort study on infected pancreatic necrosis (IPN) identified several predictors of mortality. Which of the following factors was included in the five-predictor logistic regression nomogram?",
        "options": [
          "A. Gender of the patient",
          "B. Body Mass Index (BMI)",
          "C. Time from onset to first intervention",
          "D. Serum amylase level at the time of diagnosis"
        ],
        "correct": "C",
        "explanation": "This factor, along with age and organ failure metrics, was found to have a significant non-linear relationship with mortality.",
        "hint": "Focus on factors related to the clinical timeline and the severity of the inflammatory complications."
      },
      {
        "question": "The ACG 2024 guidelines address the role of nutrition in acute pancreatitis. What is the current recommendation regarding refeeding in these patients?",
        "options": [
          "A. Early refeeding is safe and important in preventing complications",
          "B. Patients should remain NPO for at least 72 hours to allow the pancreas to 'rest'",
          "C. Parenteral nutrition is preferred over oral or enteral routes in the first 48 hours",
          "D. Refeeding should only begin once the patient is entirely pain-free without analgesics"
        ],
        "correct": "A",
        "explanation": "The guidelines emphasize the safety and importance of early refeeding as a strategy to improve patient outcomes.",
        "hint": "Reflect on how early intervention might benefit the integrity of the gastrointestinal system."
      },
      {
        "question": "Regarding the survival of patients with infected pancreatic necrosis (IPN), the 'conditional survival' (CS) analysis indicated that:",
        "options": [
          "A. The risk of death increases the longer a patient survives past 30 days",
          "B. Most deaths occur after 60 days of hospitalization",
          "C. Survival rates remain stagnant regardless of the duration of stay",
          "D. Real-time survival improves gradually since diagnosis"
        ],
        "correct": "D",
        "explanation": "The study demonstrated that 90-day survival rates increased from 0.778 at baseline to over 0.99 for those surviving 75 days.",
        "hint": "Think about the trend of survival probability for a patient who has already successfully navigated the first few weeks of the illness."
      },
      {
        "question": "In the study of methylnaltrexone for acute pancreatitis, how did the treatment affect morphine equivalent doses and pain scores at 48 hours?",
        "options": [
          "A. It increased pain interference due to the blockade of peripheral receptors",
          "B. It allowed for a 50% reduction in opioid requirements due to synergistic effects",
          "C. It significantly reduced the need for opioids by enhancing endogenous analgesia",
          "D. There were no differences between the methylnaltrexone and placebo groups in pain severity or opioid use"
        ],
        "correct": "D",
        "explanation": "The trial confirmed that the addition of methylnaltrexone did not alter analgesia or the amount of opioids required.",
        "hint": "Consider the 'non-inferiority' of the analgesic effect when using a peripherally acting antagonist."
      },
      {
        "question": "The updated ASGE guideline on the management of benign pancreatic disease specifically addresses the endoscopic management of which complication?",
        "options": [
          "A. Malignant pancreatic ductal adenocarcinoma",
          "B. Routine screening for pancreatic cysts in asymptomatic patients",
          "C. Type 1 Autoimmune Pancreatitis diagnostic criteria",
          "D. Pancreatic fluid collections and duct disruptions"
        ],
        "correct": "D",
        "explanation": "The ASGE provides specific recommendations on the selection and timing of drainage for these specific benign conditions.",
        "hint": "Focus on the procedural aspects mentioned, such as drainage techniques."
      },
      {
        "question": "What percentage of patients with acute pancreatitis are estimated to progress to severe complications such as pancreatic necrosis or organ failure?",
        "options": [
          "A. Over 50% of all hospital admissions",
          "B. Approximately 5%",
          "C. Nearly one-fifth of patients",
          "D. Exactly 35% across all populations"
        ],
        "correct": "C",
        "explanation": "The ACG abstract notes that while most patients have mild disease, almost 20% experience severe complications.",
        "hint": "Identify the fraction of the population that moves from typical symptoms to the need for intensive or radiologic intervention."
      },
      {
        "question": "The random survival forest model for IPN patients identified which of the following as one of the seven foremost predictors of mortality?",
        "options": [
          "A. History of alcohol consumption",
          "B. Duration of organ failure",
          "C. Presence of a pseudocyst",
          "D. Serum Calcium levels"
        ],
        "correct": "B",
        "explanation": "Both the number and the duration of organ failure were identified as critical predictors of mortality in the prospective cohort.",
        "hint": "Consider the physiologic markers of systemic failure over time."
      },
      {
        "question": "According to the systematic review on post-ERCP pancreatitis (PEP), PEP is characterized as:",
        "options": [
          "A. An inevitable outcome that cannot be predicted or risk-stratified",
          "B. A rare complication occurring in less than 0.1% of procedures",
          "C. The most common serious adverse event associated with the procedure",
          "D. A complication primarily driven by the patient's age and gender alone"
        ],
        "correct": "C",
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
          "A. Resmetirom",
          "B. Semaglutide",
          "C. Tirzepatide",
          "D. Pegozafermin"
        ],
        "correct": "D",
        "explanation": "In the network meta-analysis, pegozafermin was ranked as the most effective intervention for fibrosis regression with a SUCRA score of 79.92.",
        "hint": "Consider the ranking of a fibroblast growth factor 21 (FGF-21) analog mentioned in the meta-analysis."
      },
      {
        "question": "In the B-Well 1 and B-Well 2 phase 3 trials, what was the primary mechanism of action for bepirovirsen in the treatment of chronic hepatitis B virus (HBV) infection?",
        "options": [
          "A. Antisense oligonucleotide targeting HBV transcripts",
          "B. Monoclonal antibody neutralizing HBsAg",
          "C. Capsid assembly modulator blocking viral encasement",
          "D. Nucleoside analogue inhibiting viral polymerase"
        ],
        "correct": "A",
        "explanation": "Bepirovirsen works by binding to and promoting the degradation of viral RNA, which can lead to a reduction in viral proteins and a potential functional cure.",
        "hint": "Focus on the specific molecular strategy used to degrade viral genetic messages."
      },
      {
        "question": "Based on the B-Well trial results for chronic HBV, which laboratory abnormality was identified as the most common grade 3 or higher adverse event in patients receiving bepirovirsen?",
        "options": [
          "A. Bilirubin elevation reaching Hy's Law criteria",
          "B. Serum creatinine elevation",
          "C. Decrease in absolute neutrophil count",
          "D. Increase in alanine aminotransferase (ALT) level"
        ],
        "correct": "D",
        "explanation": "ALT flares were noted in 6% of the bepirovirsen group and are often associated with the immune clearance of infected hepatocytes during treatment.",
        "hint": "Think about common markers of liver inflammation or immune-mediated hepatocyte turnover."
      },
      {
        "question": "Which of the following describes the definition of a 'functional cure' as used in the phase 3 trials of bepirovirsen for noncirrhotic chronic HBV infection?",
        "options": [
          "A. HBeAg seroconversion with persistence of low-level HBsAg",
          "B. Complete eradication of intrahepatic cccDNA",
          "C. Sustained HBsAg loss and HBV DNA below the LLOQ for at least 24 weeks after therapy",
          "D. Undetectable HBV DNA while remaining on stable nucleoside analogue therapy"
        ],
        "correct": "C",
        "explanation": "A functional cure implies the host immune system has controlled the virus to the point where surface antigen is undetectable and viral load is suppressed post-treatment.",
        "hint": "This term refers to a specific clinical state maintained after the discontinuation of all antiviral medications."
      },
      {
        "question": "In the context of MASLD (formerly NAFLD) management, what is the primary clinical utility of the 'Clinical care pathway' recently emphasized by the AGA and other major societies?",
        "options": [
          "A. Standardizing noninvasive fibrosis risk stratification and management",
          "B. Replacing lifestyle interventions with early-stage pharmacotherapy",
          "C. Mandating liver biopsy for all patients with metabolic syndrome",
          "D. Providing a legal framework for insurance coverage of bariatric surgery"
        ],
        "correct": "A",
        "explanation": "Care pathways are designed to help clinicians move beyond simple diagnosis toward actionable staging using noninvasive tests to guide therapy.",
        "hint": "Consider the shift toward using biomarkers and elastography to determine the severity of liver scarring."
      },
      {
        "question": "Which of the following pharmacological agents ranked highest for achieving MASH resolution without worsening fibrosis in the 2025 network meta-analysis?",
        "options": [
          "A. Obeticholic acid",
          "B. Vitamin E",
          "C. Pegozafermin",
          "D. Lanifibranor"
        ],
        "correct": "C",
        "explanation": "Pegozafermin achieved the highest SUCRA score (91.75) for MASH resolution, slightly outperforming other potent agents like survodutide.",
        "hint": "This agent is a long-acting glycopegylated FGF-21 analog."
      },
      {
        "question": "The ASGE guideline on the management of esophageal varices in cirrhosis highlights which combination of endoscopic techniques for the treatment of gastric varices?",
        "options": [
          "A. Radiofrequency ablation and mucosal resection",
          "B. Hemostatic powder spray and clip placement",
          "C. Sclerotherapy and argon plasma coagulation",
          "D. Cyanoacrylate injection and band ligation"
        ],
        "correct": "D",
        "explanation": "These techniques are standard endoscopic approaches for managing gastric and esophageal varices, with cyanoacrylate being particularly relevant for certain gastric variceal types.",
        "hint": "Think about the specialized 'glue' used for gastric varices versus the standard 'looping' method for esophageal ones."
      },
      {
        "question": "What significant change in nomenclature was introduced to replace the term 'Nonalcoholic Fatty Liver Disease (NAFLD)' to better reflect the underlying pathophysiology and reduce stigma?",
        "options": [
          "A. Insulin-resistant hepatosteatosis syndrome (IRHS)",
          "B. Metabolic dysfunction-associated steatohepatitis (MASH)",
          "C. Metabolic-associated fatty liver disease (MAFLD)",
          "D. Metabolic dysfunction-associated steatotic liver disease (MASLD)"
        ],
        "correct": "D",
        "explanation": "The new nomenclature integrates metabolic risk factors into the definition and uses 'steatotic' instead of 'fatty' to avoid stigmatizing language.",
        "hint": "The new acronym starts with 'M' and ends with 'SLD'."
      },
      {
        "question": "In the pooled analysis of the B-Well trials for bepirovirsen, what was the approximate percentage of patients who achieved a functional cure at week 72?",
        "options": [
          "A. 40-50%",
          "B. 19-20%",
          "C. 5-10%",
          "D. 75-80%"
        ],
        "correct": "B",
        "explanation": "The B-Well 1 and B-Well 2 trials reported functional cure rates of 20% and 19% respectively, which were significantly higher than the 0% in the placebo groups.",
        "hint": "The percentage is approximately one-fifth of the treated population."
      },
      {
        "question": "Based on the pharmacological comparison for MASH resolution, which of the following 'dual' agents (targeting both GIP and GLP-1 receptors) was significantly better than placebo?",
        "options": [
          "A. Tirzepatide",
          "B. Liraglutide",
          "C. Resmetirom",
          "D. Semaglutide"
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
          "A. Sustained clinical remission without the use of corticosteroids for at least 6 months.",
          "B. Normalization of fecal calprotectin (FC) and C-reactive protein (CRP) levels.",
          "C. Histologic remission confirmed by a gastrointestinal pathologist.",
          "D. The combination of symptomatic remission and endoscopic healing."
        ],
        "correct": "D",
        "explanation": "Deep remission is defined as achieving both patient-reported symptomatic improvement and restoration of intact mucosa without friability.",
        "hint": "Consider the dual requirements of patient-reported outcomes and mucosal appearance."
      },
      {
        "question": "In a prospective study of IBD patients treated with Infliximab (IFX), which pharmacokinetic parameter was identified as the primary predictor of infection risk?",
        "options": [
          "A. Peak serum concentration measured 2 hours post-infusion.",
          "B. Cumulative exposure represented by AUC_{0-8wk}.",
          "C. Preinfusion trough concentration (C_{trough}).",
          "D. The presence of high-titer anti-Infliximab antibodies."
        ],
        "correct": "B",
        "explanation": "The area under the concentration-time curve over 8 weeks was found to be the primary predictor, suggesting cumulative exposure drives safety concerns.",
        "hint": "Focus on the parameter that represents total drug exposure over a dosing interval."
      },
      {
        "question": "A patient is diagnosed with ulcerative colitis involving the rectum and extending to the splenic flexure. How should this disease extent be categorized according to ACG guidelines?",
        "options": [
          "A. Proctitis",
          "B. Extensive colitis",
          "C. Proctosigmoiditis",
          "D. Left-sided colitis"
        ],
        "correct": "D",
        "explanation": "Left-sided colitis is defined as disease extending from the sigmoid colon up to the splenic flexure.",
        "hint": "Identify the specific anatomical landmark that separates left-sided disease from extensive disease."
      },
      {
        "question": "Based on the integration of six phase 3 trials, what was the safety finding regarding upadacitinib use in patients with moderate-to-severe IBD?",
        "options": [
          "A. Safety signals were only evident in the 30 mg maintenance group.",
          "B. A dose-dependent increase in gastrointestinal perforations.",
          "C. No new safety signals were identified compared to previous data.",
          "D. Increased risk of major adverse cardiovascular events (MACE) compared to placebo."
        ],
        "correct": "C",
        "explanation": "The six-trial analysis confirmed the existing safety profile of upadacitinib without uncovering novel risks in UC or Crohn's disease.",
        "hint": "Consider the overall conclusion regarding the emergence of novel adverse events."
      },
      {
        "question": "When managing a patient with mildly to moderately active UC, within what timeframe should they be reassessed to determine the response to induction therapy?",
        "options": [
          "A. 2 weeks",
          "B. 12 weeks",
          "C. 8 weeks",
          "D. 4 weeks"
        ],
        "correct": "C",
        "explanation": "The 2025 ACG guidelines recommend reassessing patients within 8 weeks to determine if the induction therapy has been successful.",
        "hint": "Think of a standard two-month window often used in clinical trials for induction endpoints."
      },
      {
        "question": "According to research on the pre-clinical phase of IBD, how long before a formal diagnosis can variation in antibody response be detected?",
        "options": [
          "A. Approximately 20 years",
          "B. Approximately 1 year",
          "C. Approximately 4 years",
          "D. Approximately 10 years"
        ],
        "correct": "D",
        "explanation": "Disease-specific antibody differences were found to be detectable as early as 10 years before the onset of symptoms and diagnosis.",
        "hint": "The detection of these markers significantly predates even the earliest symptomatic changes."
      },
      {
        "question": "In the context of Infliximab therapy, which of the following was associated with a REDUCED risk of infection (OR: 0.51) in the GLMM analysis?",
        "options": [
          "A. Younger age at diagnosis.",
          "B. Low-dose immunomodulator use.",
          "C. Subcutaneous (SC) dosing vs Intravenous (IV) dosing.",
          "D. Concomitant corticosteroid use."
        ],
        "correct": "B",
        "explanation": "Surprisingly, the use of low-dose immunomodulators was associated with a lower risk of infection in this specific cohort analysis.",
        "hint": "Look for a therapy often used in combination with biologics that showed an unexpected protective association in this study."
      },
      {
        "question": "For a patient suspected of having UC, what is the recommended endoscopic procedure to confirm the diagnosis and assess disease extent?",
        "options": [
          "A. Flexible sigmoidoscopy with rectal biopsy.",
          "B. Wireless capsule endoscopy to evaluate the entire small bowel.",
          "C. Colonoscopy with intubation of the ileum and biopsies of affected and unaffected areas.",
          "D. Upper endoscopy and cross-sectional imaging for all patients."
        ],
        "correct": "C",
        "explanation": "Guidelines require full colonoscopy and ileal intubation to distinguish UC from Crohn's and accurately map disease extent.",
        "hint": "A complete evaluation of the colon and the final segment of the small intestine is necessary."
      },
      {
        "question": "What was the week-16 remission rate for patients who had failed prior therapy when treated with upadacitinib, compared to comparator therapies?",
        "options": [
          "A. Remission rates were equal across both groups at week 16.",
          "B. 60% with upadacitinib vs 40% with comparator.",
          "C. 48% with upadacitinib vs 27% with comparator.",
          "D. 35% with upadacitinib vs 15% with comparator."
        ],
        "correct": "C",
        "explanation": "Patients with prior UC therapy failure achieved a significantly higher remission rate of 48% with upadacitinib compared to 27% with other treatments.",
        "hint": "The remission rate for the drug of interest was nearly double that of the comparator in this refractory group."
      },
      {
        "question": "Which of the following is considered a 'weaker' prognostic factor when deciding whether to treat mildly to moderately active UC with therapies usually reserved for moderate-to-severe disease?",
        "options": [
          "A. Previous need for hospitalization.",
          "B. Age alone.",
          "C. Severe endoscopic activity (e.g., UCEIS score).",
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
          "A. All IBD medications should be discontinued during the first trimester to prevent teratogenicity.",
          "B. The health of the mother best supports the health of the infant.",
          "C. Fetal safety should always take precedence over maternal symptom control.",
          "D. Neonatal outcomes are primarily determined by the mode of delivery rather than maternal disease activity."
        ],
        "correct": "B",
        "explanation": "The consensus emphasizes that maintaining maternal disease control is the primary driver for successful pregnancy and neonatal outcomes.",
        "hint": "Consider the relationship between maternal wellness and neonatal health mentioned in the consensus statement."
      },
      {
        "question": "A 13-year follow-up analysis of the NordICC trial evaluated the impact of colonoscopy screening invitations on colorectal cancer (CRC) incidence. What was the observed reduction in CRC incidence in the intention-to-screen analysis?",
        "options": [
          "A. 5%",
          "B. 50%",
          "C. 19%",
          "D. 84%"
        ],
        "correct": "C",
        "explanation": "The multicountry randomized trial found that being invited to colonoscopy screening lowered the incidence of CRC by 19% over a 13-year median follow-up.",
        "hint": "The reduction was significant but reflected the challenges of an intention-to-screen population analysis."
      },
      {
        "question": "Regarding Lynch syndrome surveillance, what is the primary clinical benefit of frequent surveillance according to recent findings?",
        "options": [
          "A. A significant reduction in colorectal cancer incidence",
          "B. Lower overall mortality",
          "C. Prevention of extracolonic malignancies",
          "D. Decreased rates of late-stage cancer diagnosis"
        ],
        "correct": "B",
        "explanation": "The evidence indicates that while surveillance may not prevent the occurrence of cancer, it is linked to better survival outcomes and lower mortality.",
        "hint": "Distinguish between the occurrence of the disease and the ultimate survival of the patient."
      },
      {
        "question": "An integrated safety analysis of six phase 3 trials for upadacitinib in patients with ulcerative colitis and Crohn's disease concluded which of the following?",
        "options": [
          "A. A new association between upadacitinib and gastric cancer was discovered.",
          "B. The placebo group had higher rates of serious adverse events than the 15 mg group.",
          "C. Safety signals were significantly higher in the 30 mg maintenance group compared to induction.",
          "D. No new safety signals were identified compared to existing data."
        ],
        "correct": "D",
        "explanation": "The analysis of over 5,000 patient-years of exposure showed a safety profile consistent with previous findings for the drug.",
        "hint": "Consider the long-term safety exposure data and whether the results were unexpected."
      },
      {
        "question": "The AGA Living Clinical Practice Guideline on pharmacological management of moderate-to-severe ulcerative colitis (UC) includes 14 specific recommendations. Which of these is a major focus area of the guideline?",
        "options": [
          "A. Management of mild, distal ulcerative proctitis",
          "B. Advanced therapies and treatment positioning",
          "C. Surgical techniques for total proctocolectomy",
          "D. Standardization of random biopsy protocols for dysplasia"
        ],
        "correct": "B",
        "explanation": "The guideline emphasizes the role and sequence of advanced therapies, including combination therapy, for managing moderate-to-severe UC.",
        "hint": "Focus on the pharmacological scope and the level of disease severity being addressed."
      },
      {
        "question": "According to the British Columbia Colon Screening Program cohort study, what is the recommended management for a patient who has a positive fecal immunochemical test (FIT) following a recent colonoscopy?",
        "options": [
          "A. Wait for 10 years before the next surveillance colonoscopy.",
          "B. Perform a breath test for small intestinal bacterial overgrowth (SIBO).",
          "C. Disregard the FIT result as a false positive due to the recent colonoscopy.",
          "D. Offer a repeat colonoscopy."
        ],
        "correct": "D",
        "explanation": "The study found that a positive interval FIT is a significant marker for post-colonoscopy colorectal cancer, warranting another exam.",
        "hint": "Think about how an interval 'red flag' test should influence the clinical workflow regardless of prior screening."
      },
      {
        "question": "In the context of gastric cancer risk, what HR (hazard ratio) is associated with the daily consumption of sugary drinks?",
        "options": [
          "A. 4.04",
          "B. 2.45",
          "C. 1.19",
          "D. 1.00"
        ],
        "correct": "B",
        "explanation": "The source explicitly states that daily consumption of sugary drinks is linked to a more than double risk, specifically HR 2.45 (95% CI, 1.49-4.04).",
        "hint": "The risk is described as 'more than double' the baseline."
      },
      {
        "question": "The Global Consensus on Pregnancy and IBD highlights that varied practices and fear of fetal harm among providers are largely driven by which of the following?",
        "options": [
          "A. The universal adoption of the GRADE process across all countries",
          "B. A surplus of high-quality randomized controlled trials (RCTs)",
          "C. Limited knowledge and high reliance on local dogma",
          "D. High rates of medication adherence among pregnant patients"
        ],
        "correct": "C",
        "explanation": "The consensus identifies limited provider knowledge and individual interpretation of literature as key reasons for inconsistent care.",
        "hint": "Look for the factor that explains why different doctors might treat the same pregnancy differently."
      },
      {
        "question": "The ASGE guideline on IBD management addresses the role of endoscopy in surveillance. Which technique is specifically mentioned for the management of IBD-related complications such as strictures?",
        "options": [
          "A. Routine capsule endoscopy in active colitis",
          "B. Prophylactic surgical bypass",
          "C. Endoscopic therapy",
          "D. Total mesenteric excision"
        ],
        "correct": "C",
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
        "question": "A 54-year-old individual undergoes a screening colonoscopy, during which a 4 mm flat-elevated lesion is discovered in the ascending colon. Optical diagnosis with narrow-band imaging suggests an adenoma. Which resection approach is recommended for this lesion?",
        "options": [
          "A. Hot biopsy forceps polypectomy",
          "B. Endoscopic mucosal resection with submucosal injection",
          "C. Cold forceps polypectomy",
          "D. Cold snare polypectomy"
        ],
        "correct": "D",
        "explanation": "Cold snare polypectomy provides high complete resection rates while eliminating electrocautery-related risks such as deep tissue perforation and delayed bleeding.",
        "hint": "Consider the method that balances complete tissue removal with minimal risk of thermal injury for diminutive polyps."
      },
      {
        "question": "During a surveillance colonoscopy, a 25 mm pedunculated lesion with a 6 mm thick stalk is encountered in the sigmoid colon. Which strategy is recommended prior to transecting the stalk with hot snare polypectomy?",
        "options": [
          "A. Prophylactic mechanical ligation with a clip or detachable loop",
          "B. Epinephrine injection alone without mechanical closure",
          "C. Piecemeal cold snare resection of the stalk base",
          "D. Submucosal injection of normal saline into the stalk base"
        ],
        "correct": "A",
        "explanation": "Mechanical ligation of stalks 5 mm or thicker or heads 20 mm or larger significantly reduces immediate and delayed post-polypectomy hemorrhage.",
        "hint": "Think about how to control the substantial vascular supply running through a wide stalk."
      },
      {
        "question": "A 60-year-old patient is found to have a 25 mm laterally spreading granular-type tumor in the cecum without features of deep submucosal invasion. What is the recommended primary management strategy?",
        "options": [
          "A. Argon plasma coagulation ablation of the intact lesion",
          "B. Referral directly for elective laparoscopic colectomy",
          "C. Cold forceps piecemeal debulking",
          "D. Endoscopic mucosal resection"
        ],
        "correct": "D",
        "explanation": "Endoscopic mucosal resection offers curative resection for large non-pedunculated benign lesions while avoiding the higher morbidity, mortality, and cost of surgical resection.",
        "hint": "Consider the first-line therapeutic approach that avoids invasive surgery for large benign mucosal lesions."
      },
      {
        "question": "Which morphologic subclassification of laterally spreading tumors (LSTs) carries the highest overall risk for harboring submucosal invasion?",
        "options": [
          "A. Granular nodular mixed (LST-G-NM)",
          "B. Non-granular pseudodepressed (LST-NG-PD)",
          "C. Granular homogenous (LST-G-H)",
          "D. Non-granular flat elevated (LST-NG-FE)"
        ],
        "correct": "B",
        "explanation": "This subtype carries a submucosal invasion risk of approximately 31.6%, which is substantially higher than granular or flat elevated subtypes.",
        "hint": "Look for the lesion type combining a smooth surface with a depressed central architectural feature."
      },
      {
        "question": "An endoscopist identifies a 22 mm non-pedunculated polyp in the transverse colon that requires marking for potential future surgical or endoscopic localization. What is the recommended tattooing technique?",
        "options": [
          "A. Place a single tattoo 1 cm proximal (cecal side) to the lesion",
          "B. Inject the tattoo agent exclusively into the muscularis propria layer",
          "C. Inject directly into the submucosa of the polyp base during removal",
          "D. Place 2 to 3 separate injection sites located 3 to 5 cm anatomically distal (anal side) to the lesion"
        ],
        "correct": "D",
        "explanation": "Injecting distal to the lesion ensures clear localization while preventing carbon suspension from diffusing near the lesion and inducing technical submucosal fibrosis.",
        "hint": "Focus on avoiding submucosal fibrosis near the target tissue while keeping the mark easily identifiable during scope insertion."
      },
      {
        "question": "Following piecemeal endoscopic mucosal resection (EMR) of a 30 mm granular laterally spreading tumor, meticulous inspection shows no grossly visible residual adenoma. What step is recommended to minimize local adenoma recurrence?",
        "options": [
          "A. Adjuvant thermal ablation of the post-EMR mucosal defect margin",
          "B. Deployment of an over-the-scope clip across the central defect",
          "C. Routine biopsy sampling across the entire raw muscularis base",
          "D. Argon plasma coagulation applied directly to the center of the deep muscle base"
        ],
        "correct": "A",
        "explanation": "Applying thermal ablation (such as snare tip soft coagulation) to the normal-appearing defect margin significantly reduces recurrence by treating microscopic residual neoplasia.",
        "hint": "Consider how to eliminate microscopic neoplastic cells left at the perimeter of the resection zone."
      },
      {
        "question": "A patient undergoes successful piecemeal endoscopic mucosal resection of a 25 mm sessile serrated lesion in the ascending colon. What is the recommended surveillance schedule following complete macro-resection?",
        "options": [
          "A. First surveillance colonoscopy at 3 years",
          "B. Repeat colonoscopy in 2 to 4 weeks",
          "C. First surveillance colonoscopy at 6 months, then at 1 year, and then at 3 years",
          "D. First surveillance colonoscopy at 10 years"
        ],
        "correct": "C",
        "explanation": "Piecemeal EMR carries a notable risk of local recurrence, necessitating close early endoscopic re-evaluation at 6 months followed by 1-year and 3-year intervals.",
        "hint": "Recall the intensive follow-up timeline designed specifically to detect and treat early local scar recurrences after piecemeal resection."
      },
      {
        "question": "An endoscopist completes a wide-field EMR of a 22 mm flat adenoma in the ascending colon. Which factor strongly supports performing prophylactic clip closure of the resection defect?",
        "options": [
          "A. The routine use of carbon dioxide insufflation during the procedure",
          "B. The presence of a normal pit pattern on post-resection scar inspection",
          "C. The lesion's location in the right colon and size 20 mm or larger",
          "D. The choice of normal saline over viscous injection fluids"
        ],
        "correct": "C",
        "explanation": "Prophylactic clipping of defects 20 mm or larger in the proximal colon significantly reduces the incidence of delayed post-polypectomy hemorrhage.",
        "hint": "Think about which anatomic location and lesion size threshold show a clear benefit for reducing delayed post-EMR bleeding with clip closure."
      },
      {
        "question": "During narrow-band imaging (NBI) evaluation of a 7 mm rectal lesion, the endoscopist observes brown vessels surrounding white oval and tubular structures (NICE Type 2). What is the predicted histology and management recommendation?",
        "options": [
          "A. Normal colonic mucosa; requires no intervention or documentation",
          "B. Adenoma; recommended for complete endoscopic removal",
          "C. Deep submucosal invasive cancer; requires biopsy and surgical referral",
          "D. Hyperplastic polyp; suitable for leaving in place without resection"
        ],
        "correct": "B",
        "explanation": "NICE Type 2 features correspond to adenomatous histology, which warrants complete endoscopic resection regardless of colon location.",
        "hint": "Map the specified NICE classification features (brown vessels surrounding white structures) to its corresponding histological category."
      },
      {
        "question": "Examination of a 15 mm non-pedunculated colonic lesion under narrow-band imaging reveals disrupted vessels, patchy white avascular areas, and an amorphous surface pattern (NICE Type 3). What is the most appropriate management?",
        "options": [
          "A. Perform piecemeal hot snare endoscopic mucosal resection (EMR)",
          "B. Perform cold snare polypectomy to avoid electrocautery complications",
          "C. Obtain targeted biopsies, place a distal tattoo, and refer the patient for surgical evaluation",
          "D. Perform thermal ablation with argon plasma coagulation to destroy the invasive tissue"
        ],
        "correct": "C",
        "explanation": "NICE Type 3 features indicate deep submucosal invasive cancer (>1000 microns), where endoscopic resection is contraindicated due to high lymph node metastasis and residual disease risks.",
        "hint": "Identify the proper approach when endoscopic signs indicate deep submucosal cancer exceeding 1000 microns in depth."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "usmstf-endoscopic-removal-colorectal-lesions-2020.pdf"
    ],
    "quizGeneratedAt": "2026-10-10T04:20:00.000Z",
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
        "question": "A 54-year-old patient presents with a visible anal mass. During physical examination, gentle distraction of the gluteal cheeks allows complete visualization of the entire lesion, which is centered 3 cm from the anal orifice. How should this lesion be classified according to standardized anatomical terminology?",
        "options": [
          "A. Anal canal lesion",
          "B. Perianal (anal margin) lesion",
          "C. Distal rectal mucosal lesion",
          "D. Non-gastrointestinal cutaneous skin lesion"
        ],
        "correct": "B",
        "explanation": "Lesions within 5 cm of the anal orifice that can be completely visualized with distraction of the gluteal cheeks are classified as perianal lesions.",
        "hint": "Consider the combination of full visibility upon cheek distraction and distance from the anal orifice."
      },
      {
        "question": "A pathologist reviews an anal biopsy specimen and finds histological changes equivocal between low-grade and high-grade squamous intraepithelial dysplasia. Which biomarker staining pattern strongly supports upgrading the diagnosis to a high-grade squamous intraepithelial lesion (HSIL)?",
        "options": [
          "A. Strong positive p16 immunostaining",
          "B. Weak or absent p16 immunostaining",
          "C. Low Ki-67 nuclear proliferation index",
          "D. Complete loss of E-cadherin expression"
        ],
        "correct": "A",
        "explanation": "Strong and diffuse p16 positivity indicates HPV integration into the host genome and confirms an HSIL diagnosis in equivocal cases.",
        "hint": "Think about the tumor suppressor gene product that serves as a surrogate marker for high-risk HPV oncogenic integration."
      },
      {
        "question": "A 61-year-old male is diagnosed with a 3.5 cm T2N0M0 squamous cell carcinoma of the anal canal. What is the primary standard of care treatment intended for initial disease control?",
        "options": [
          "A. External beam radiation monotherapy to 65 Gy",
          "B. Concurrent chemoradiotherapy with 5-fluorouracil and mitomycin-C",
          "C. Primary abdominoperineal resection with end colostomy",
          "D. Neoadjuvant induction chemotherapy followed by radical resection"
        ],
        "correct": "B",
        "explanation": "Standard first-line therapy for anal canal squamous cell carcinoma is organ-preserving chemoradiotherapy combining fluoropyrimidines and mitomycin-C.",
        "hint": "Recall the non-surgical organ-preservation regimen that replaced primary resection as first-line therapy."
      },
      {
        "question": "When formulating a chemoradiotherapy regimen for anal squamous cell carcinoma, how does substituting cisplatin for mitomycin-C (MMC) impact clinical outcomes according to major Phase III trials?",
        "options": [
          "A. Cisplatin significantly reduces locoregional recurrence compared to MMC.",
          "B. Cisplatin offers no survival advantage over MMC and is associated with significantly higher colostomy rates.",
          "C. Cisplatin allows complete omission of concurrent 5-fluorouracil administration.",
          "D. Cisplatin substantially improves 5-year overall survival while reducing hematologic toxicity."
        ],
        "correct": "B",
        "explanation": "Phase III trials like RTOG 9811 demonstrated that replacing MMC with cisplatin resulted in inferior long-term overall survival and a higher rate of colostomy failure.",
        "hint": "Reflect on the findings from RTOG 9811 regarding colostomy rates and overall survival comparison."
      },
      {
        "question": "A patient undergoing definitive chemoradiotherapy for anal squamous cell carcinoma experiences grade 3 skin toxicity during week 3. What is the impact of introducing an unscheduled, multi-week rest break in the radiotherapy schedule?",
        "options": [
          "A. Treatment breaks and missed fractions are strongly correlated with higher locoregional failure and lower colostomy-free survival.",
          "B. Rest breaks allow for safe escalation of total radiation dose beyond 60 Gy.",
          "C. Rest breaks increase overall survival by allowing recovery of host cell-mediated immunity.",
          "D. Rest breaks enhance organ preservation by preventing permanent anal sphincter fibrosis."
        ],
        "correct": "A",
        "explanation": "Unplanned treatment interruptions lower the tumor control probability, directly leading to increased locoregional recurrence and compromised survival.",
        "hint": "Consider how radiation schedule compliance affects overall tumor control probability."
      },
      {
        "question": "A patient with anal canal squamous cell carcinoma completes definitive chemoradiotherapy. At the 12-week post-treatment evaluation, a small area of residual induration is palpated at the primary site, but the patient is otherwise asymptomatic. What is the most appropriate management plan?",
        "options": [
          "A. Maintain close clinical surveillance with re-examination at 5 to 6 months post-treatment prior to performing biopsy.",
          "B. Proceed immediately to salvage abdominoperineal resection due to treatment failure.",
          "C. Perform immediate deep punch biopsies under anesthesia to confirm residual tumor presence.",
          "D. Initiate second-line chemotherapy with carboplatin and paclitaxel."
        ],
        "correct": "A",
        "explanation": "Tumor regression post-chemoradiotherapy can be slow, with nearly 30% of patients who show residual abnormalities at 11–12 weeks achieving complete remission by 26 weeks.",
        "hint": "Tumor regression after chemoradiotherapy can take up to six months to complete."
      },
      {
        "question": "A 48-year-old female is diagnosed with a 1.2 cm, well-differentiated squamous cell carcinoma of the perianal skin. Staging workup confirms node-negative disease (T1N0M0) without sphincter involvement. What is the recommended definitive management strategy?",
        "options": [
          "A. High-dose-rate brachytherapy monotherapy",
          "B. Abdominoperineal resection with bilateral inguinal lymph node dissection",
          "C. Wide local excision with 1-cm resection margins",
          "D. Full-dose concurrent chemoradiotherapy with 5-fluorouracil and mitomycin-C"
        ],
        "correct": "C",
        "explanation": "Small (T1), well-differentiated, node-negative perianal lesions can be cured with wide local excision with 1-cm margins while avoiding chemoradiotherapy toxicity.",
        "hint": "Assess whether this specific subgroup of perianal lesions can be cured without radiation toxicity."
      },
      {
        "question": "An HIV-positive patient with a CD4 count of 350 cells/\\mu\\text{L} and undetectable viral load is diagnosed with stage II (T2N0M0) anal canal squamous cell carcinoma. How should his primary oncologic treatment compare to that of an HIV-negative patient?",
        "options": [
          "A. Chemotherapy doses should be reduced by 50% empirically to prevent severe myelosuppression.",
          "B. He should receive standard full-dose chemoradiotherapy identical to immunocompetent patients.",
          "C. Primary abdominoperineal resection should be performed due to excessive radiation toxicity.",
          "D. Chemotherapy agents must be omitted, administering radiation monotherapy alone."
        ],
        "correct": "B",
        "explanation": "HIV-positive patients without active medical deconditioning tolerate standard chemoradiotherapy regimens well, achieving similar response and survival rates.",
        "hint": "Immunocompetent and well-compensated HIV-infected individuals share similar treatment tolerance and outcomes."
      },
      {
        "question": "A patient develops biopsy-proven persistent squamous cell carcinoma of the anal canal 7 months after completing full-course chemoradiotherapy. Re-staging demonstrates localized pelvic disease without distant metastases. What is the definitive salvage therapy of choice?",
        "options": [
          "A. Salvage abdominoperineal resection",
          "B. Systemic palliative chemotherapy monotherapy",
          "C. Wide local excision of the anal canal mucosa",
          "D. Re-irradiation with a high-dose external beam boost"
        ],
        "correct": "A",
        "explanation": "Abdominoperineal resection is the standard curative salvage procedure for localized persistent or recurrent disease following chemoradiotherapy failure.",
        "hint": "Identify the standard surgical salvage procedure required when non-operative primary therapy fails."
      },
      {
        "question": "What is the primary diagnostic utility of Endoanal Ultrasound (EAUS) or pelvic Magnetic Resonance Imaging (MRI) in the initial pretreatment evaluation of anal squamous cell carcinoma?",
        "options": [
          "A. Distinguishing between squamous cell carcinoma and adenocarcinoma histologies",
          "B. Measuring metabolic tumor activity prior to initiating systemic chemotherapy",
          "C. Replacing systemic CT imaging for distant metastatic evaluation",
          "D. Defining primary tumor depth, sphincter involvement, and perirectal nodal status for radiotherapy field design"
        ],
        "correct": "D",
        "explanation": "Both EAUS and pelvic MRI offer precise anatomical detail regarding local tissue invasion and regional nodal involvement essential for accurate radiation treatment planning.",
        "hint": "Focus on the anatomical information needed by radiation oncologists to plan locoregional therapy fields."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "ascrs-anal-squamous-cell-cancers-2018-source-page.pdf"
    ],
    "quizGeneratedAt": "2026-10-10T04:20:00.000Z",
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
        "question": "A 35-year-old female presents with chronic diarrhea and a 10-lb weight loss. Serologic screening reveals an elevated tissue transglutaminase IgA (TTG-IgA) level at 5 times the upper limit of normal. She is scheduled for an esophagogastroduodenoscopy (EGD). According to the ACG guidelines, which duodenal biopsy protocol is recommended to confirm the diagnosis of celiac disease?",
        "options": [
          "A. Obtaining 4 biopsies exclusively from the duodenal bulb.",
          "B. Obtaining 2 biopsies from the postbulbar duodenum without bulb sampling.",
          "C. Obtaining a single biopsy specimen from the distal duodenum.",
          "D. Obtaining 1 or 2 biopsies from the duodenal bulb and at least 4 biopsies from the postbulbar duodenum."
        ],
        "correct": "D",
        "explanation": "Multiple biopsies including 1–2 from the bulb (9-o'clock or 12-o'clock position) and at least 4 from the distal/postbulbar duodenum maximize diagnostic yield due to the potential patchiness of villous atrophy.",
        "hint": "Consider the potential patchiness of histological lesions and the diagnostic yield of combining proximal and distal duodenal sampling."
      },
      {
        "question": "A 42-year-old male with severe agoraphobia and endoscopy phobia presents with persistent diarrhea, fatigue, and weight loss. His serum TTG-IgA is markedly elevated at greater than 10 times the upper limit of normal. He refuses upper endoscopy. Which step allows for an 'after-the-fact' diagnosis of likely celiac disease according to ACG guidelines?",
        "options": [
          "A. Obtaining an endomysial antibody (EMA) test on a second, separate blood sample.",
          "B. Initiating a 2-week trial of a gluten-free diet to observe clinical response alone.",
          "C. Performing HLA-DQ2/DQ8 genetic testing as a direct replacement for mucosal histology.",
          "D. Ordering a deamidated gliadin peptide (DGP) IgG assay on the initial blood sample."
        ],
        "correct": "A",
        "explanation": "In symptomatic adults unable or unwilling to undergo endoscopy, combining a high-level TTG-IgA (>10x upper limit of normal) with a positive EMA on a separate blood sample can establish a diagnosis of likely celiac disease.",
        "hint": "Focus on the secondary confirmatory antibody required in a separate blood draw within the nonbiopsy criteria."
      },
      {
        "question": "A 28-year-old female initiated a strict gluten-free diet on her own 6 months ago, resulting in complete resolution of her digestive symptoms. She now seeks formal confirmation of whether she has celiac disease. What is the recommended initial step in her diagnostic evaluation?",
        "options": [
          "A. Perform HLA-DQ2/DQ8 genetic typing to rule out celiac disease if negative.",
          "B. Perform an urgent upper endoscopy with duodenal biopsies without dietary modification.",
          "C. Check serum TTG-IgA level while remaining strictly on her gluten-free diet.",
          "D. Immediately start a 3 g/day gluten challenge for 6 weeks followed by duodenal biopsy."
        ],
        "correct": "A",
        "explanation": "Testing for HLA-DQ2/DQ8 in individuals already on a gluten-free diet is essential because a negative result definitively rules out celiac disease, avoiding an unnecessary gluten challenge.",
        "hint": "Think about the test that has a nearly 100% negative predictive value and can safely rule out celiac disease without requiring gluten ingestion."
      },
      {
        "question": "An 18-month-old child presents with chronic diarrhea and failure to thrive. Total serum IgA levels are verified to be within normal limits for age. According to ACG guidelines, what is the preferred single serologic screening test for celiac disease in this child?",
        "options": [
          "A. Combining TTG-IgA with DGP-IgA in routine initial screening.",
          "B. Deamidated gliadin peptide IgG antibody (DGP-IgG) alone.",
          "C. Immunoglobulin A anti-tissue transglutaminase antibody (TTG-IgA).",
          "D. Endomysial antibody IgA (EMA-IgA) as a standalone primary screen."
        ],
        "correct": "C",
        "explanation": "ACG guidelines updated the algorithm to recommend TTG-IgA as the preferred single initial test for celiac disease in children younger than 2 years who are not IgA deficient.",
        "hint": "Consider the updated recommendation regarding first-line screening in pediatric patients under 2 years of age with normal IgA levels."
      },
      {
        "question": "A 50-year-old male undergoes upper endoscopy for dyspepsia. Duodenal histology demonstrates 32 intraepithelial lymphocytes per 100 epithelial cells with normal villous architecture (lymphocytic duodenosis). TTG-IgA serology is negative. What is the most appropriate interpretation of this histologic finding?",
        "options": [
          "A. It represents Marsh 3a celiac disease requiring lifelong immunosuppressive therapy.",
          "B. It definitively confirms latent celiac disease, requiring routine genetic typing before further workup.",
          "C. It is non-specific for celiac disease and requires evaluation for other etiologies such as H. pylori infection, NSAID use, or SIBO.",
          "D. It is pathognomonic for celiac disease and mandates immediate initiation of a strict gluten-free diet."
        ],
        "correct": "C",
        "explanation": "Lymphocytic duodenosis (\\ge 25 intraepithelial lymphocytes per 100 epithelial cells) without villous atrophy is common in the general population and is most frequently caused by non-celiac etiologies.",
        "hint": "Recall that increased intraepithelial lymphocytes without villous atrophy can stem from various common medications or non-celiac gastrointestinal conditions."
      },
      {
        "question": "A 38-year-old female diagnosed with celiac disease 2 years ago has remained completely asymptomatic on a strict gluten-free diet. Her follow-up serology demonstrates complete seroconversion to negative. She asks if her intestinal mucosa has completely healed. What should the clinician communicate based on ACG guidelines?",
        "options": [
          "A. Negative serology does not guarantee mucosal healing, and a follow-up duodenal biopsy after 2 years on a GFD can be considered via shared decision-making.",
          "B. Follow-up biopsy to assess mucosal healing is strictly contraindicated in asymptomatic individuals.",
          "C. Intestinal mucosal healing occurs universally in adults within 6 months of starting a gluten-free diet.",
          "D. Seroconversion to negative perfectly correlates with complete mucosal recovery, making endoscopy unnecessary."
        ],
        "correct": "A",
        "explanation": "Serologic normalization correlates poorly with histological mucosal recovery in adults; repeat duodenal biopsy after 2 years is the only reliable method to confirm mucosal healing.",
        "hint": "Consider the degree of correlation between antibody levels in blood and architectural recovery of duodenal villi in adults."
      },
      {
        "question": "A 31-year-old male with celiac disease inquires about purchasing a point-of-care gluten detection device that tests urine or stool biospecimens to assist with dietary choices. What is the ACG guideline recommendation regarding routine clinical use of these technologies?",
        "options": [
          "A. Routine use is strongly recommended for all celiac disease patients to ensure zero gluten ingestion.",
          "B. Routine use is suggested against, as these devices may detect clinically insignificant gluten exposure and lack evidence of improving outcomes.",
          "C. Biospecimen testing devices are recommended exclusively for asymptomatic patients to prevent silent mucosal injury.",
          "D. Urine detection tests should replace traditional dietitian interviews during routine follow-up visits."
        ],
        "correct": "B",
        "explanation": "ACG guidelines suggest against routine use of gluten detection devices because highly sensitive biospecimen tests can detect trivial exposures below toxicity thresholds without proven clinical benefit.",
        "hint": "Focus on the clinical significance of ultra-low gluten detection limits and the availability of outcome data regarding these tools."
      },
      {
        "question": "A 45-year-old female with biopsy-confirmed celiac disease presents with persistent abdominal pain and diarrhea after 12 months on a prescribed gluten-free diet. What is the recommended initial step in the systematic evaluation of nonresponsive celiac disease?",
        "options": [
          "A. Perform immediate CT enterography to rule out enteropathy-associated T-cell lymphoma.",
          "B. Immediately initiate open-capsule budesonide for refractory celiac disease.",
          "C. Confirm the original diagnosis, review celiac serologies, and refer for expert dietitian evaluation to identify unintentional gluten exposure.",
          "D. Order a repeat duodenal biopsy with intraepithelial lymphocyte flow cytometry prior to dietary assessment."
        ],
        "correct": "C",
        "explanation": "Unintentional gluten contamination is the leading cause of nonresponsive celiac disease, requiring verification of the initial diagnosis, serologic check, and comprehensive dietary evaluation by a specialized dietitian.",
        "hint": "Identify the single most common cause of ongoing symptoms in patients following a gluten-free diet."
      },
      {
        "question": "A patient with nonresponsive celiac disease undergoes repeat duodenal biopsy after 18 months of confirmed strict gluten-free diet adherence, revealing persistent villous atrophy. Flow cytometry shows a clonal population of intraepithelial T-lymphocytes lacking CD8 surface markers. What is the diagnosis and associated clinical outlook?",
        "options": [
          "A. Unintentional gluten contamination, requiring only minor dietary adjustments.",
          "B. Autoimmune enteropathy, which responds completely to short-term probiotic supplementation.",
          "C. Type 1 Refractory Celiac Disease, which is typically managed solely by eliminating processed foods.",
          "D. Type 2 Refractory Celiac Disease, which carries a poor prognosis and an increased risk of enteropathy-associated T-cell lymphoma."
        ],
        "correct": "D",
        "explanation": "Type 2 Refractory Celiac Disease is defined by abnormal, clonal T-cell populations (such as CD3+ CD8- cells) and is associated with significant mortality and lymphoma risk.",
        "hint": "Pay attention to the presence of clonal T-cells and aberrantly low CD8 marker expression on intraepithelial lymphocytes."
      },
      {
        "question": "A patient newly diagnosed with celiac disease asks whether oats can be safely consumed as part of a gluten-free diet. According to ACG guidelines, what advice should be provided regarding oat consumption?",
        "options": [
          "A. Oats are recommended only after demonstrating complete mucosal healing on a follow-up duodenal biopsy at 2 years.",
          "B. Gluten-free oats are recommended, but patients must be monitored for tolerance due to potential gluten contamination or rare avenin reactivity.",
          "C. Commercial oats may be consumed freely without requiring gluten-free certification or clinical follow-up.",
          "D. All oats must be permanently avoided because the oat protein avenin causes universal toxicity in celiac disease."
        ],
        "correct": "B",
        "explanation": "ACG guidelines recommend including pure gluten-free oats in the GFD, while advising clinical monitoring for tolerance because of variable oat toxicity, avenin sensitivity, or cross-contamination.",
        "hint": "Consider the safety of pure oats alongside the need to account for cross-contamination and individual protein sensitivity."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "acg-celiac-disease-guideline-2023.pdf"
    ],
    "quizGeneratedAt": "2026-10-10T04:20:00.000Z",
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
        "question": "A 62-year-old male presents with melena. Standard upper endoscopy and colonoscopy are both performed and yield completely normal findings. According to the ACG guideline terminology, how should this patient's bleeding be classified prior to performing video capsule endoscopy (VCE)?",
        "options": [
          "A. Occult gastrointestinal bleeding",
          "B. Overt small bowel bleeding",
          "C. Obscure gastrointestinal bleeding",
          "D. Potential small bowel bleeding"
        ],
        "correct": "D",
        "explanation": "After normal standard upper and lower endoscopic examinations and prior to capsule endoscopy or direct small bowel evaluation, guidelines classify the condition as potential small bowel bleeding.",
        "hint": "Consider the provisional state of classification after unrevealing conventional endoscopies but before small-bowel-specific testing."
      },
      {
        "question": "A 68-year-old female presents with brisk, active hematochezia and is hemodynamically stable. Upper endoscopy and colonoscopy are negative for active bleeding. Which diagnostic study is preferred next to locate the active bleeding site in this setting?",
        "options": [
          "A. Barium small bowel follow-through",
          "B. Multiphasic CT angiography (CTA)",
          "C. Conventional mesenteric angiography",
          "D. Computed tomographic enterography (CTE)"
        ],
        "correct": "B",
        "explanation": "In stable patients with brisk active overt GI bleeding, multiphasic CTA is preferred over CT enterography because oral contrast is not required and extravasation of IV contrast can rapidly pinpoint active bleeding.",
        "hint": "Think about which cross-sectional imaging technique avoids oral contrast to detect contrast extravasation in active bleeding."
      },
      {
        "question": "A 55-year-old male with recurrent melena and iron deficiency anemia has unrevealing upper and lower endoscopies. He has no prior history of abdominal surgery or symptoms of bowel obstruction. What is the recommended first-line procedure for evaluating the small bowel in this patient?",
        "options": [
          "A. Meckel's scan",
          "B. Double-balloon enteroscopy (DBE)",
          "C. Computed tomographic enterography (CTE)",
          "D. Video capsule endoscopy (VCE)"
        ],
        "correct": "D",
        "explanation": "VCE is recommended as the first-line procedure for small bowel evaluation once upper and lower GI sources have been excluded and there are no contraindications such as suspected obstruction.",
        "hint": "Identify the primary non-invasive endoscopic modality recommended for comprehensive visualization of the small intestinal mucosa."
      },
      {
        "question": "A 32-year-old male presents with recurrent hematochezia and iron deficiency anemia. Second-look upper endoscopy and colonoscopy are negative. Which etiology is among the most common causes of small bowel bleeding in patients under 40 years of age?",
        "options": [
          "A. Degenerative small bowel angioectasias",
          "B. Portal hypertensive enteropathy",
          "C. Inflammatory bowel disease and Meckel's diverticulum",
          "D. NSAID-induced small bowel ulcers"
        ],
        "correct": "C",
        "explanation": "Age is a key determinant of small bowel bleeding pathology; patients under age 40 are significantly more likely to present with inflammatory bowel disease, Meckel's diverticulum, or polyposis syndromes.",
        "hint": "Recall how etiology stratifies by patient age (under 40 versus over 40 years)."
      },
      {
        "question": "A 72-year-old female undergoes video capsule endoscopy for occult GI bleeding. A single, small, non-bleeding jejunal angioectasia is identified. She is asymptomatic with a stable hemoglobin of 10.8 g/dL. What is the recommended management for this finding?",
        "options": [
          "A. Initiation of long-term somatostatin analog therapy",
          "B. Conservative management with iron supplementation",
          "C. Surgical resection of the involved jejunal segment",
          "D. Urgent deep enteroscopy with argon plasma coagulation"
        ],
        "correct": "B",
        "explanation": "Guidelines recommend conservative management with oral or IV iron when no active bleeding source is found or when isolated small vascular lesions without active hemorrhage are detected.",
        "hint": "Consider whether every small, non-bleeding vascular lesion seen on capsule endoscopy mandates invasive intervention."
      },
      {
        "question": "A 6-year-old girl with chronic diarrhea and abdominal distension has a tissue transglutaminase IgA (TTG-IgA) level >10 times the upper limit of normal. A second separate blood sample tests positive for endomysial antibodies (EMA). According to ACG guidelines, what is the best management step?",
        "options": [
          "A. Perform HLA-DQ2/DQ8 genetic testing to confirm diagnosis",
          "B. Establish the diagnosis of celiac disease using nonbiopsy criteria",
          "C. Initiate a 6-week daily gluten challenge followed by repeat serology",
          "D. Perform obligatory EGD with duodenal biopsies before treatment"
        ],
        "correct": "B",
        "explanation": "The combination of high-level TTG-IgA (>10x ULN) and a positive EMA in a second blood draw is suggested as a reliable nonbiopsy diagnostic strategy for celiac disease in children.",
        "hint": "Recall the pediatric nonbiopsy criteria endorsed by the updated ACG celiac disease guideline."
      },
      {
        "question": "An adult patient with persistent diarrhea and high-positive TTG-IgA serology undergoes EGD to evaluate for celiac disease. To adhere to ACG diagnostic standards, how should duodenal mucosal biopsies be taken?",
        "options": [
          "A. 2 biopsies from the distal duodenum and 2 from the proximal jejunum",
          "B. 2 biopsies from the stomach antrum and 2 from the duodenal bulb",
          "C. 4 biopsies exclusively from the duodenal bulb",
          "D. 1 or 2 biopsies from the duodenal bulb and 4 from the distal duodenum"
        ],
        "correct": "D",
        "explanation": "To maximize diagnostic sensitivity for celiac disease, guidelines specify taking 1 or 2 biopsies from the duodenal bulb (at 9 or 12 o'clock positions) and 4 from the distal duodenum.",
        "hint": "Consider the specific total number and anatomical distribution of duodenal biopsies recommended during EGD."
      },
      {
        "question": "An 80-year-old man with severe aortic stenosis and recurrent GI bleeding is found to have diffuse small bowel angioectasias (Heyde's syndrome). Despite repeated endoscopic therapy with argon plasma coagulation, he continues to require blood transfusions. What intervention is recommended to reduce his rebleeding risk?",
        "options": [
          "A. Aortic valve replacement",
          "B. Long-term oral thalidomide therapy",
          "C. Surgical resection of the jejunum",
          "D. Continuous long-term IV somatostatin infusion"
        ],
        "correct": "A",
        "explanation": "In patients with Heyde's syndrome (aortic stenosis associated with bleeding angioectasias), aortic valve replacement resolves the acquired von Willebrand factor deficiency and significantly reduces rebleeding risk.",
        "hint": "Think about the underlying hemodynamic and hematologic mechanism connecting aortic stenosis to angioectasia bleeding."
      },
      {
        "question": "A 42-year-old woman with a history of terminal ileal Crohn's disease and prior ileocolic resection presents with iron-deficiency anemia and intermittent crampy abdominal pain. Upper endoscopy and colonoscopy are negative. What is the most appropriate step prior to administering video capsule endoscopy (VCE)?",
        "options": [
          "A. Immediate double-balloon enteroscopy via rectal route",
          "B. Barium small bowel follow-through",
          "C. Tagged red blood cell (RBC) scintigraphy",
          "D. Computed tomographic enterography (CTE)"
        ],
        "correct": "D",
        "explanation": "In patients with established inflammatory bowel disease, prior bowel surgery, or suspected strictures, CTE or patency capsule should be performed prior to VCE to evaluate for stenosis and avoid capsule retention.",
        "hint": "Identify the main risk factor for capsule retention and how guidelines recommend screening for it."
      },
      {
        "question": "Which of the following modalities is explicitly recommended AGAINST by the ACG clinical guidelines for evaluating small bowel bleeding due to low diagnostic yield?",
        "options": [
          "A. Tagged red blood cell scintigraphy",
          "B. Push enteroscopy",
          "C. Computed tomographic enterography (CTE)",
          "D. Barium studies"
        ],
        "correct": "D",
        "explanation": "The ACG guideline issues a strong recommendation (high level of evidence) that barium studies should not be performed in the evaluation of small bowel bleeding due to diagnostic yields under 10%.",
        "hint": "Recall which traditional fluoroscopic imaging technique is formally replaced by cross-sectional and capsule techniques."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "acg-small-bowel-bleeding-guideline-2015.pdf",
      "acg-celiac-disease-guideline-2023.pdf"
    ],
    "quizGeneratedAt": "2026-10-10T04:20:00.000Z",
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
        "question": "A gastroenterology fellow is summarizing literature on biologics for ulcerative colitis. She needs an AI tool that directly answers her clinical question, displays an evidence 'Meter' reflecting consensus across studies, shows quality scores, and integrates with her Zotero library. Which tool best fits this requirement?",
        "options": [
          "A. Consensus",
          "B. Elicit",
          "C. Connected Papers",
          "D. Scite.ai"
        ],
        "correct": "A",
        "explanation": "Consensus provides a clear visual synthesis meter along with study quality scores and allows direct integration with Zotero collections.",
        "hint": "Consider which platform features a distinct visual gauge of overall agreement and integrates directly with reference libraries."
      },
      {
        "question": "A GI research group is categorizing AI tools by maturity and operational risk according to a manuscript workflow framework. They plan to use ChatGPT for initial text drafting, Writefull for grammar polishing, and Elicit for paper discovery. How are these tasks risk-stratified based on operational risk to manuscript integrity?",
        "options": [
          "A. Literature discovery with Elicit is high risk; drafting text with ChatGPT is medium risk; editing with Writefull is low risk.",
          "B. Drafting text with ChatGPT is high risk; literature discovery with Elicit is low risk; editing with Writefull is low risk.",
          "C. Editing with Writefull is high risk; literature discovery with Elicit is medium risk; drafting text with ChatGPT is low risk.",
          "D. Literature discovery with Elicit is medium risk; drafting text with ChatGPT is low risk; editing with Writefull is high risk."
        ],
        "correct": "B",
        "explanation": "Tools that write prose for direct inclusion carry high risk due to reference fabrication, whereas tools that discover literature or polish grammar are classified as low risk.",
        "hint": "Focus on whether the tool generates original manuscript text versus discovering or refining existing scholarly content."
      },
      {
        "question": "An investigator uploads a deidentified dataset comparing two clinical sites undergoing endoscopic submucosal dissection (ESD). An LLM generates a baseline Table 1 and selects statistical tests automatically. For body mass index (BMI), the AI reports median [IQR] and uses the Mann-Whitney U test instead of Student's t-test. What motivated this specific statistical selection?",
        "options": [
          "A. The user specifically requested a Chi-square test for continuous demographic variables.",
          "B. The BMI sample size was below 30 patients at Site A, forcing a non-parametric test.",
          "C. The Shapiro-Wilk test indicated a non-normal distribution for BMI at Site A (P = .03).",
          "D. The outcome variable was categorical with fewer than 5 expected events per cell."
        ],
        "correct": "C",
        "explanation": "Detecting non-normality via a Shapiro-Wilk test prompts the model to switch from parametric t-tests to non-parametric Mann-Whitney U tests.",
        "hint": "Recall how advanced LLMs evaluate continuous distributional assumptions prior to choosing parametric vs non-parametric hypothesis tests."
      },
      {
        "question": "A researcher is prompting an AI tool to create a baseline outcomes table comparing three groups of biologic-naive patients receiving vedolizumab, adalimumab, or ustekinumab. What essential prompting instruction should be included to prevent inflating the false positive rate across multiple statistical comparisons?",
        "options": [
          "A. Specify a Bonferroni, Holm, or Benjamini-Hochberg correction for pairwise comparisons.",
          "B. Request Student's t-tests across all three arms simultaneously without adjusting alpha.",
          "C. Omit expected cell count criteria so Fisher's exact test is applied universally.",
          "D. Instruct the model to convert all continuous variables into binary categorical variables."
        ],
        "correct": "A",
        "explanation": "Without explicit instructions on multiple testing adjustments, LLMs may perform unadjusted pairwise comparisons, substantially inflating the type I error rate.",
        "hint": "Think about statistical adjustments required when performing multiple simultaneous hypothesis tests across three treatment arms."
      },
      {
        "question": "A research group needs an AI platform specifically to evaluate manuscript baseline data, perform publication-ready layout formatting, and display output dynamically in LaTeX or Markdown via a live interactive user interface. According to the benchmarked comparison of LLMs for clinical data analysis, which platform is best suited for this publication task?",
        "options": [
          "A. Gemini (3.1 pro) due to its 2 million token context window.",
          "B. NotebookLM due to its automatic RIS file parsing engine.",
          "C. Claude (Opus 4.6) due to its clinical reasoning and Artifacts UI preview.",
          "D. ChatGPT (GPT-5.4) due to its sandbox execution of Excel files."
        ],
        "correct": "C",
        "explanation": "Claude leads in publication readiness and clinical reasoning because its 'Artifacts' interface delivers live previews of professional Markdown, HTML, or LaTeX tables.",
        "hint": "Consider which model features an interactive 'Artifacts' environment tailored for live formatting of Markdown and LaTeX tables."
      },
      {
        "question": "A GI fellow attempts to use an AI text-to-image generator to create a procedural schematic depicting an endoscopic ultrasound-guided gastrojejunostomy (EUS-GJ). The output shows misplaced stents and incorrect small bowel connectivity. Why do standard text-to-image AI generators consistently fail to produce accurate medical illustrations?",
        "options": [
          "A. They operate on statistical pixel probabilities rather than explicit functional anatomical maps.",
          "B. Copyright protections on medical journals prevent AI models from training on clinical images.",
          "C. Current image models are strictly restricted to processing non-medical clinical charts.",
          "D. Medical illustrations require vector resolution that AI neural networks cannot process."
        ],
        "correct": "A",
        "explanation": "Generative image models prioritize likely pixel patterns from training data without understanding underlying anatomical orientation or functional connectivity rules.",
        "hint": "Reflect on the underlying probabilistic mechanism of text-to-image AI models compared to rule-based anatomical knowledge."
      },
      {
        "question": "To prevent anatomical hallucinations in a procedural figure, authors follow the recommended 'structure-first' workflow for GI anatomical illustrations. Which sequence represents the correct step-by-step methodology outlined in the review?",
        "options": [
          "A. Generate prompt in Midjourney \\rightarrow Upload to ChatGPT for vectorization ightarrow Manually draw labels in Word.",
          "B. Create hand sketch in FigureLabs \\rightarrow Export to Gemini for complete prompt-based redrawing ightarrow Publish without manual editing.",
          "C. Download validated template \\rightarrow Apply structural constraint prompt in AI ightarrow Use vectorization tool for manual element tuning.",
          "D. Prompt DALL-E for base anatomy \\rightarrow Overlay statistical heatmaps in Python ightarrow Convert to JPG."
        ],
        "correct": "C",
        "explanation": "The validated framework relies on starting with a structurally accurate base template, applying structural constraints during AI refinement, and using vector tools for final precise adjustments.",
        "hint": "Recall the multi-step process that starts with an established, validated open-access anatomical reference image before applying selective AI modifications."
      },
      {
        "question": "An author wants to copyedit the prose of a draft manuscript. She needs a tool specifically trained on academic datasets that preserves scientific formulas, citation keys, and numerical formatting during editing. Which tool is purpose-built for this requirement?",
        "options": [
          "A. Gamma",
          "B. ChatGPT",
          "C. Elicit",
          "D. Paperpal"
        ],
        "correct": "D",
        "explanation": "Paperpal is purpose-built for academic writing, maintaining scientific equations, citations, and precise numerical formatting while refining grammar.",
        "hint": "Select the dedicated academic language editor designed to safeguard formatted numbers, references, and math symbols while editing."
      },
      {
        "question": "Prior to journal submission, an investigator uploads the complete draft of a GI manuscript into an LLM to conduct a presubmission manuscript audit. What is a key quality control task suitable for an LLM during this audit phase?",
        "options": [
          "A. Generating original primary outcome conclusions without human oversight.",
          "B. Calculating final P values and hazard ratios directly from raw, uncleaned patient records.",
          "C. Replacing institutional IRB approval documentation with AI compliance certificates.",
          "D. Checking numerical consistency between data reported in the Abstract and the Results tables."
        ],
        "correct": "D",
        "explanation": "LLMs excel at cross-referencing text sections to spot discrepancies between Abstract summaries and body text or tables.",
        "hint": "Consider the textual verification tasks where LLMs review existing manuscript sections to identify internal contradictions."
      },
      {
        "question": "A research group plans to upload clinical data to a commercial cloud-based AI tool for statistical script generation. What administrative requirement must be satisfied before patient-level clinical data can be uploaded to a cloud AI platform?",
        "options": [
          "A. Disclosing the AI platform name in the manuscript's acknowledgment section prior to data processing.",
          "B. Obtaining a verbal agreement from the platform's customer support agent.",
          "C. Ensuring full deidentification per HIPAA standards or executing an institutional Business Associate Agreement (BAA) permitting cloud AI use.",
          "D. Removing only the patient's full name while keeping medical record numbers and admission dates intact."
        ],
        "correct": "C",
        "explanation": "HIPAA compliance mandates removing all 18 identifiers (Safe Harbor) or executing a formal institutional BAA with the cloud vendor before transferring patient data.",
        "hint": "Identify the formal legal document or complete deidentification standard required when handling protected health information on cloud networks."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "cgh-ai-tools-gi-research-practical-guide-2026.pdf"
    ],
    "quizGeneratedAt": "2026-10-10T04:20:00.000Z",
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
        "question": "A 54-year-old individual undergoes a screening colonoscopy, during which a 4 mm flat-elevated lesion is discovered in the ascending colon. Optical diagnosis with narrow-band imaging suggests an adenoma. Which resection approach is recommended for this lesion?",
        "options": [
          "A. Cold snare polypectomy",
          "B. Endoscopic mucosal resection with submucosal injection",
          "C. Cold forceps polypectomy",
          "D. Hot biopsy forceps polypectomy"
        ],
        "correct": "A",
        "explanation": "Cold snare polypectomy provides high complete resection rates while eliminating electrocautery-related risks such as deep tissue perforation and delayed bleeding.",
        "hint": "Consider the method that balances complete tissue removal with minimal risk of thermal injury for diminutive polyps."
      },
      {
        "question": "During a surveillance colonoscopy, a 25 mm pedunculated lesion with a 6 mm thick stalk is encountered in the sigmoid colon. Which strategy is recommended prior to transecting the stalk with hot snare polypectomy?",
        "options": [
          "A. Prophylactic mechanical ligation with a clip or detachable loop",
          "B. Submucosal injection of normal saline into the stalk base",
          "C. Piecemeal cold snare resection of the stalk base",
          "D. Epinephrine injection alone without mechanical closure"
        ],
        "correct": "A",
        "explanation": "Mechanical ligation of stalks 5 mm or thicker or heads 20 mm or larger significantly reduces immediate and delayed post-polypectomy hemorrhage.",
        "hint": "Think about how to control the substantial vascular supply running through a wide stalk."
      },
      {
        "question": "A 60-year-old patient is found to have a 25 mm laterally spreading granular-type tumor in the cecum without features of deep submucosal invasion. What is the recommended primary management strategy?",
        "options": [
          "A. Argon plasma coagulation ablation of the intact lesion",
          "B. Endoscopic mucosal resection",
          "C. Cold forceps piecemeal debulking",
          "D. Referral directly for elective laparoscopic colectomy"
        ],
        "correct": "B",
        "explanation": "Endoscopic mucosal resection offers curative resection for large non-pedunculated benign lesions while avoiding the higher morbidity, mortality, and cost of surgical resection.",
        "hint": "Consider the first-line therapeutic approach that avoids invasive surgery for large benign mucosal lesions."
      },
      {
        "question": "Which morphologic subclassification of laterally spreading tumors (LSTs) carries the highest overall risk for harboring submucosal invasion?",
        "options": [
          "A. Granular nodular mixed (LST-G-NM)",
          "B. Non-granular pseudodepressed (LST-NG-PD)",
          "C. Non-granular flat elevated (LST-NG-FE)",
          "D. Granular homogenous (LST-G-H)"
        ],
        "correct": "B",
        "explanation": "This subtype carries a submucosal invasion risk of approximately 31.6%, which is substantially higher than granular or flat elevated subtypes.",
        "hint": "Look for the lesion type combining a smooth surface with a depressed central architectural feature."
      },
      {
        "question": "An endoscopist identifies a 22 mm non-pedunculated polyp in the transverse colon that requires marking for potential future surgical or endoscopic localization. What is the recommended tattooing technique?",
        "options": [
          "A. Inject directly into the submucosa of the polyp base during removal",
          "B. Place 2 to 3 separate injection sites located 3 to 5 cm anatomically distal (anal side) to the lesion",
          "C. Place a single tattoo 1 cm proximal (cecal side) to the lesion",
          "D. Inject the tattoo agent exclusively into the muscularis propria layer"
        ],
        "correct": "B",
        "explanation": "Injecting distal to the lesion ensures clear localization while preventing carbon suspension from diffusing near the lesion and inducing technical submucosal fibrosis.",
        "hint": "Focus on avoiding submucosal fibrosis near the target tissue while keeping the mark easily identifiable during scope insertion."
      },
      {
        "question": "Following piecemeal endoscopic mucosal resection (EMR) of a 30 mm granular laterally spreading tumor, meticulous inspection shows no grossly visible residual adenoma. What step is recommended to minimize local adenoma recurrence?",
        "options": [
          "A. Argon plasma coagulation applied directly to the center of the deep muscle base",
          "B. Adjuvant thermal ablation of the post-EMR mucosal defect margin",
          "C. Deployment of an over-the-scope clip across the central defect",
          "D. Routine biopsy sampling across the entire raw muscularis base"
        ],
        "correct": "B",
        "explanation": "Applying thermal ablation (such as snare tip soft coagulation) to the normal-appearing defect margin significantly reduces recurrence by treating microscopic residual neoplasia.",
        "hint": "Consider how to eliminate microscopic neoplastic cells left at the perimeter of the resection zone."
      },
      {
        "question": "A patient undergoes successful piecemeal endoscopic mucosal resection of a 25 mm sessile serrated lesion in the ascending colon. What is the recommended surveillance schedule following complete macro-resection?",
        "options": [
          "A. First surveillance colonoscopy at 10 years",
          "B. First surveillance colonoscopy at 3 years",
          "C. First surveillance colonoscopy at 6 months, then at 1 year, and then at 3 years",
          "D. Repeat colonoscopy in 2 to 4 weeks"
        ],
        "correct": "C",
        "explanation": "Piecemeal EMR carries a notable risk of local recurrence, necessitating close early endoscopic re-evaluation at 6 months followed by 1-year and 3-year intervals.",
        "hint": "Recall the intensive follow-up timeline designed specifically to detect and treat early local scar recurrences after piecemeal resection."
      },
      {
        "question": "An endoscopist completes a wide-field EMR of a 22 mm flat adenoma in the ascending colon. Which factor strongly supports performing prophylactic clip closure of the resection defect?",
        "options": [
          "A. The choice of normal saline over viscous injection fluids",
          "B. The lesion's location in the right colon and size 20 mm or larger",
          "C. The routine use of carbon dioxide insufflation during the procedure",
          "D. The presence of a normal pit pattern on post-resection scar inspection"
        ],
        "correct": "B",
        "explanation": "Prophylactic clipping of defects 20 mm or larger in the proximal colon significantly reduces the incidence of delayed post-polypectomy hemorrhage.",
        "hint": "Think about which anatomic location and lesion size threshold show a clear benefit for reducing delayed post-EMR bleeding with clip closure."
      },
      {
        "question": "During narrow-band imaging (NBI) evaluation of a 7 mm rectal lesion, the endoscopist observes brown vessels surrounding white oval and tubular structures (NICE Type 2). What is the predicted histology and management recommendation?",
        "options": [
          "A. Deep submucosal invasive cancer; requires biopsy and surgical referral",
          "B. Normal colonic mucosa; requires no intervention or documentation",
          "C. Hyperplastic polyp; suitable for leaving in place without resection",
          "D. Adenoma; recommended for complete endoscopic removal"
        ],
        "correct": "D",
        "explanation": "NICE Type 2 features correspond to adenomatous histology, which warrants complete endoscopic resection regardless of colon location.",
        "hint": "Map the specified NICE classification features (brown vessels surrounding white structures) to its corresponding histological category."
      },
      {
        "question": "Examination of a 15 mm non-pedunculated colonic lesion under narrow-band imaging reveals disrupted vessels, patchy white avascular areas, and an amorphous surface pattern (NICE Type 3). What is the most appropriate management?",
        "options": [
          "A. Perform thermal ablation with argon plasma coagulation to destroy the invasive tissue",
          "B. Obtain targeted biopsies, place a distal tattoo, and refer the patient for surgical evaluation",
          "C. Perform piecemeal hot snare endoscopic mucosal resection (EMR)",
          "D. Perform cold snare polypectomy to avoid electrocautery complications"
        ],
        "correct": "B",
        "explanation": "NICE Type 3 features indicate deep submucosal invasive cancer (>1000 microns), where endoscopic resection is contraindicated due to high lymph node metastasis and residual disease risks.",
        "hint": "Identify the proper approach when endoscopic signs indicate deep submucosal cancer exceeding 1000 microns in depth."
      }
    ],
    "quizStatus": "repo-managed-complete",
    "quizSourcePdfs": [
      "usmstf-endoscopic-removal-colorectal-lesions-2020.pdf"
    ],
    "quizGeneratedAt": "2026-10-10T04:20:00.000Z",
    "resourceNotes": "Existing guideline/WeeklyArchive cards were preserved automatically; new targeted online-search cards were filtered through Schedule Review.",
    "fetchedAt": "2026-10-01T00:00:00.000Z",
    "resourceStatus": "approved"
  }
};

export default scheduleResources;
