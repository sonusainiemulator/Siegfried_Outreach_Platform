/**
 * Seeder for Ethical Mental Health Marketing & Clinical Psychology Social Templates
 * Tailored specifically to Christopher Siegfried's practice (https://christophersiegfried.com)
 * and evidence-based psychological and medical clinics.
 */
const mongoose = require('mongoose');

const socialTemplateSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  category:        { type: String, required: true },
  contentType:     { type: String },
  platform:        { type: String, default: 'All' },
  type: {
    type: String,
    enum: ['Image', 'Carousel', 'Reel', 'Video', 'Story'],
    required: true
  },
  previewImageUrl: { type: String },
  creditCost:      { type: Number, required: true },
  basePrompt:      { type: String },
  variables:       { type: [String], default: [] },
  designConfig:    { type: mongoose.Schema.Types.Mixed },
  isActive:        { type: Boolean, default: true },
  usageCount:      { type: Number, default: 0 }
}, {
  timestamps: true
});

const SocialTemplate = mongoose.models.SocialTemplate || mongoose.model('SocialTemplate', socialTemplateSchema);

const ETHICAL_TEMPLATES = [
  {
    name: 'Ethical Marketing as an Extension of Care — 5-Slide Manifesto',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Educational',
    platform: 'All',
    type: 'Carousel',
    previewImageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80',
    creditCost: 10,
    basePrompt: 'Create a 5-slide educational carousel for {{business_name}} titled "Why Ethical Mental Health Marketing is an Extension of Clinical Care". Slide 1: The Problem with Clickbait Mental Health Advice (empty promises, predatory algorithms). Slide 2: Why Superficial "Feel-Good" Fluff Falls Short of Evidence-Based Healing. Slide 3: The AI Boundary — AI lacks an amygdala, emotional memory, and clinical accountability; human oversight is vital. Slide 4: Marketing as a Caring Guide — Providing honest, scientifically backed education so clients make informed choices. Slide 5: Welcome to {{business_name}} located in {{location}}. Our commitment: {{usp}}. Call {{phone}} or visit {{website}}.',
    variables: ['business_name', 'location', 'usp', 'phone', 'website', 'cta'],
    isActive: true,
    usageCount: 48
  },
  {
    name: 'OCD vs Pop Culture Misconceptions — ERP Reality Breakdown',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Clinical Insight',
    platform: 'Instagram',
    type: 'Carousel',
    previewImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80',
    creditCost: 12,
    basePrompt: 'Design a 5-slide clinical myth-buster carousel for {{business_name}} on Obsessive-Compulsive Disorder (OCD). Slide 1: "I\'m so OCD" — Why pop culture gets it wrong. Slide 2: The Obsession-Compulsion Cycle: Intrusive thoughts, spiking distress, and temporary relief rituals that reinforce fear. Slide 3: The Gold Standard Treatment: Exposure & Response Prevention (ERP) explained with compassion. Slide 4: You are not your thoughts — Breaking taboo themes without shame. Slide 5: Specialized, evidence-based care at {{business_name}} ({{location}}). Reach out: {{phone}} | {{website}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta', 'usp'],
    isActive: true,
    usageCount: 39
  },
  {
    name: 'Panic Attack vs Anxiety Attack — Physiological Somatic Guide',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Educational',
    platform: 'All',
    type: 'Image',
    previewImageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80',
    creditCost: 6,
    basePrompt: 'Design a clean, therapeutic infographic for {{business_name}} comparing Panic Attacks (sudden autonomic nervous system surge, peak in 10 mins, physical sensations) vs Anxiety Attacks (chronic worry, gradual build-up, cognitive exhaustion). Include a clinically proven grounding micro-technique: The Physiological Sigh (two quick inhales through the nose, long slow exhale through the mouth). Branded for {{business_name}} in {{location}}. Contact: {{phone}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta'],
    isActive: true,
    usageCount: 57
  },
  {
    name: 'Rewiring Rest: CBT-I for Chronic Sleep Disorders & Insomnia',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Educational',
    platform: 'LinkedIn',
    type: 'Carousel',
    previewImageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=600&auto=format&fit=crop&q=80',
    creditCost: 10,
    basePrompt: 'Create a 4-slide evidence-based breakdown on Cognitive Behavioral Therapy for Insomnia (CBT-I) for {{business_name}}. Slide 1: Why sleeping pills don\'t cure chronic insomnia — treating conditioning vs symptoms. Slide 2: Stimulus Control: Why your bed must only mean sleep, not scrolling or tossing. Slide 3: Sleep Drive vs Hyperarousal: Taming the midnight racing brain. Slide 4: Evidence-based sleep medicine at {{business_name}} ({{location}}). Book a clinical consult: {{cta}} {{phone}}.',
    variables: ['business_name', 'location', 'phone', 'cta', 'website'],
    isActive: true,
    usageCount: 33
  },
  {
    name: 'Trauma & PTSD: Understanding the Window of Tolerance',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Clinical Insight',
    platform: 'Instagram',
    type: 'Carousel',
    previewImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    creditCost: 12,
    basePrompt: 'Generate a 5-slide trauma-informed guide for {{business_name}} on the Window of Tolerance. Slide 1: What happens when stress pushes you outside your zone of regulation? Slide 2: Hyperarousal: Fight/Flight, panic, racing thoughts, hypervigilance. Slide 3: Hypoarousal: Freeze, numbness, dissociation, heavy brain fog. Slide 4: Somatic & Cognitive Grounding: Expanding your nervous system\'s capacity for safety. Slide 5: Compassionate trauma recovery with {{business_name}}, {{location}}. Connect: {{phone}} {{website}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta'],
    isActive: true,
    usageCount: 44
  },
  {
    name: 'Therapist Reel: 60-Second De-Stigmatization of Intrusive Thoughts',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Myth Buster',
    platform: 'Instagram',
    type: 'Reel',
    previewImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    creditCost: 15,
    basePrompt: 'Write a high-converting, compassionate 60-second video script for a licensed clinician at {{business_name}}. Hook (0-5s): "If you\'ve ever had a horrifying, intrusive thought and immediately wondered \'What is wrong with me?\', stop scrolling." Script (5-45s): Explain that over 90% of healthy humans experience intrusive thoughts. Why the brain creates them, why avoiding them strengthens the anxiety loop, and why your thoughts are not your character. CTA (45-60s): "Therapy gives you the tools to disarm the fear. Reach out to {{business_name}} at {{phone}}."',
    variables: ['business_name', 'phone', 'website', 'cta', 'location'],
    isActive: true,
    usageCount: 62
  },
  {
    name: 'From Engineering Mindset to Mental Health: Overcoming Analytical Burnout',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Clinical Insight',
    platform: 'LinkedIn',
    type: 'Carousel',
    previewImageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80',
    creditCost: 10,
    basePrompt: 'Design a 5-slide thought-leadership carousel for {{business_name}} aimed at analytical professionals, engineers, and high-achievers. Slide 1: When your greatest strength (logic & problem-solving) turns against you in emotional distress. Slide 2: You cannot "debug" human emotions the way you debug code or mechanical systems. Slide 3: Perfectionism as an anxiety coping strategy: The exhausting fear of failure. Slide 4: Developing Psychological Flexibility: Letting go of rigid cognitive rules. Slide 5: Tailored therapy for analytical minds at {{business_name}} in {{location}}. Consultation: {{phone}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta', 'usp'],
    isActive: true,
    usageCount: 51
  },
  {
    name: 'Depression & Behavioral Activation: Science Over Willpower',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Educational',
    platform: 'Facebook',
    type: 'Carousel',
    previewImageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&auto=format&fit=crop&q=80',
    creditCost: 8,
    basePrompt: 'Create a 4-slide compassionate educational post for {{business_name}} on Behavioral Activation for Depression. Slide 1: The Trap: Waiting to "feel motivated" before doing anything. Slide 2: The Science: Motivation is the result of action, not the cause. Slide 3: Micro-Stepping: How 2-minute non-negotiable tasks trigger dopamine signaling and combat lethargy. Slide 4: Gentle, evidence-based depression treatment at {{business_name}} ({{location}}). We walk with you: {{phone}} | {{website}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta'],
    isActive: true,
    usageCount: 29
  },
  {
    name: 'The Anger Iceberg: Understanding What Lies Beneath the Surface',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Educational',
    platform: 'All',
    type: 'Image',
    previewImageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    creditCost: 6,
    basePrompt: 'Create an educational visual for {{business_name}} on Anger Management. Feature the "Anger Iceberg": The tip above water is Outbursts, Irritability, Sarcasm. Beneath the surface are Primary Emotions: Hurt, Grief, Fear, Exhaustion, Disrespect, and Overwhelm. Provide 3 therapeutic reflection questions before reacting. Contact {{business_name}} for specialized emotional regulation therapy: {{phone}} {{location}}.',
    variables: ['business_name', 'location', 'phone', 'cta'],
    isActive: true,
    usageCount: 38
  },
  {
    name: 'Addiction & Substance Use: An Empathetic Clinical Perspective',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Patient Care',
    platform: 'LinkedIn',
    type: 'Carousel',
    previewImageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&auto=format&fit=crop&q=80',
    creditCost: 10,
    basePrompt: 'Generate a 5-slide destigmatizing clinical carousel for {{business_name}} on Substance Use & Addiction. Slide 1: Shifting from "What\'s wrong with you?" to "What happened to you?". Slide 2: The Neurobiology of Coping: How substance use begins as a nervous system self-soothing strategy. Slide 3: Dual Diagnosis: Untangled anxiety, PTSD, and depression behind dependence. Slide 4: Harm Reduction & Compassionate Treatment: Recovery without judgment or shame. Slide 5: Confidential outpatient care at {{business_name}} in {{location}}. Reach our team: {{phone}} | {{website}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta'],
    isActive: true,
    usageCount: 31
  },
  {
    name: 'Demystifying Therapy: What Really Happens in a First Session',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Trust & Review',
    platform: 'All',
    type: 'Video',
    previewImageUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600&auto=format&fit=crop&q=80',
    creditCost: 15,
    basePrompt: 'Produce a reassuring walkthrough video script for {{business_name}} explaining the intake process for a new therapy client. Outline: 1. Warm greeting and setting the physical/virtual safe container. 2. Clarifying HIPAA confidentiality and legal rights. 3. Exploring what brought you in at your own pace (no pressure to share trauma on day one). 4. Collaborative goal setting. 5. Ending with practical next steps. Branded for {{business_name}} located in {{location}}. Contact: {{phone}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta'],
    isActive: true,
    usageCount: 74
  },
  {
    name: 'Overcoming Phobias with Systematic Desensitization',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Clinical Insight',
    platform: 'Instagram',
    type: 'Carousel',
    previewImageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    creditCost: 10,
    basePrompt: 'Design a 4-slide clinical explainer for {{business_name}} on Specific Phobias (flying, medical procedures, social scrutiny, heights). Slide 1: Phobias aren\'t irrational weakness — they are a hyperactive threat alarm. Slide 2: Why avoidance shrinks your world over time. Slide 3: Systematic Desensitization: Step-by-step graded exposure with somatic regulation. Slide 4: Reclaim your freedom with {{business_name}} ({{location}}). Book your assessment: {{phone}} {{website}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta'],
    isActive: true,
    usageCount: 27
  },
  {
    name: 'Daily Grounding Check-In: Interactive Nervous System Reset',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Educational',
    platform: 'Instagram',
    type: 'Story',
    previewImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    creditCost: 5,
    basePrompt: 'Create an interactive 3-part Story template for {{business_name}}. Slide 1: Quick pulse-check: "Where are you holding tension right now? (Jaw, Shoulders, Stomach)". Slide 2: Guided somatic release: Drop your shoulders, unclamp your jaw, take 3 deep belly breaths. Slide 3: Affirmation & Support: "You don\'t have to carry it all alone. Support is available at {{business_name}} in {{location}}." Tap to call: {{phone}}.',
    variables: ['business_name', 'location', 'phone', 'cta'],
    isActive: true,
    usageCount: 68
  },
  {
    name: 'Ethical Practice Pledge: Science, Empathy, and Transparency',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Trust & Review',
    platform: 'LinkedIn',
    type: 'Image',
    previewImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    creditCost: 6,
    basePrompt: 'Design a high-trust, elegant brand manifesto image for {{business_name}}. Headline: "Our Ethical Practice Pledge". Body: 1. Grounded in peer-reviewed psychological literature. 2. Zero clickbait, zero empty promises. 3. Full respect for your lived experience and individual autonomy. 4. Strict HIPAA privacy compliance. Signature of clinical director. Location: {{location}}. Website: {{website}} | Phone: {{phone}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta', 'usp'],
    isActive: true,
    usageCount: 46
  },
  {
    name: 'Comprehensive Clinic Care: The Mind-Body Axis in Primary Medicine',
    category: 'Healthcare & Clinic',
    contentType: 'Educational',
    platform: 'All',
    type: 'Carousel',
    previewImageUrl: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&auto=format&fit=crop&q=80',
    creditCost: 10,
    basePrompt: 'Create a 5-slide medical carousel for {{business_name}} on the Gut-Brain & Stress-Body Axis in medical clinics. Slide 1: When physical symptoms have psychosomatic roots (tension migraines, GI flareups, palpitations). Slide 2: Why integrated medical + mental health care produces 3x better patient outcomes. Slide 3: Routine health screenings that include mental wellness. Slide 4: Patient-centered diagnostic care without rush. Slide 5: Consult {{business_name}} medical team in {{location}}. Call {{phone}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta'],
    isActive: true,
    usageCount: 35
  },
  {
    name: 'Pediatric & Adolescent Wellness: Signs Your Teen Needs Support',
    category: 'Healthcare & Clinic',
    contentType: 'Patient Care',
    platform: 'Facebook',
    type: 'Carousel',
    previewImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    creditCost: 8,
    basePrompt: 'Design a 4-slide guide for parents from {{business_name}} pediatric and family clinic. Slide 1: Normal teenage moodiness vs clinical red flags. Slide 2: Key indicators: Sudden withdrawal from peers, drastic sleep changes, somatic complaints (headaches/stomachaches before school), persistent drop in grades. Slide 3: How parents can open supportive dialogue without triggering defensiveness. Slide 4: Confidential adolescent and family consultations at {{business_name}}, {{location}}. Call {{phone}}.',
    variables: ['business_name', 'location', 'phone', 'cta', 'website'],
    isActive: true,
    usageCount: 41
  },
  {
    name: 'Values-Based Living vs Avoidance: Acceptance & Commitment Therapy (ACT)',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Clinical Insight',
    platform: 'Instagram',
    type: 'Carousel',
    previewImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    creditCost: 10,
    basePrompt: 'Generate a 5-slide ACT (Acceptance and Commitment Therapy) guide for {{business_name}}. Slide 1: The difference between a pain-free life and a meaningful life. Slide 2: Emotional Avoidance: Why trying not to feel anxiety gives anxiety more power. Slide 3: Psychological Flexibility: Holding difficult emotions gently while taking values-based action. Slide 4: 3 Core Questions to Discover Your True Values Today. Slide 5: Experience ACT therapy at {{business_name}}, {{location}}. Call {{phone}} or visit {{website}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta'],
    isActive: true,
    usageCount: 34
  },
  {
    name: 'Compassionate Self-Esteem: Retraining the Internal Critic',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Educational',
    platform: 'All',
    type: 'Image',
    previewImageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&auto=format&fit=crop&q=80',
    creditCost: 6,
    basePrompt: 'Design a compassionate self-worth visual for {{business_name}}. Theme: "The Harsh Inner Critic vs The Compassionate Observer". Contrast common self-critical thoughts with clinical cognitive reframing. Quote: "Treat yourself like someone you are responsible for helping." Branded for {{business_name}}, {{location}}. Phone: {{phone}} | {{website}}.',
    variables: ['business_name', 'location', 'phone', 'website', 'cta'],
    isActive: true,
    usageCount: 47
  },
  {
    name: 'Crisis Safety & Support Protocol: Always Here When Needed',
    category: 'Ethical Mental Health Marketing',
    contentType: 'Patient Care',
    platform: 'All',
    type: 'Story',
    previewImageUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&auto=format&fit=crop&q=80',
    creditCost: 5,
    basePrompt: 'Create a warm, essential crisis resources story for {{business_name}}. Provide immediate lifeline numbers (988 Suicide & Crisis Lifeline - call or text 24/7; Crisis Text Line: text HOME to 741741; Emergency: 911). Add notice: "Your safety and dignity matter deeply to us. Non-emergency clinical scheduling at {{business_name}}: {{phone}} {{website}}."',
    variables: ['business_name', 'phone', 'website', 'location'],
    isActive: true,
    usageCount: 52
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pixel-ai';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);

    console.log('Checking & Upserting Ethical Mental Health templates...');
    let addedCount = 0;
    let updatedCount = 0;

    for (const t of ETHICAL_TEMPLATES) {
      const existing = await SocialTemplate.findOne({ name: t.name });
      if (existing) {
        await SocialTemplate.updateOne({ _id: existing._id }, { $set: t });
        updatedCount++;
      } else {
        await SocialTemplate.create(t);
        addedCount++;
      }
    }

    console.log(`Seeding complete: ${addedCount} inserted, ${updatedCount} updated.`);
    const totalEthical = await SocialTemplate.countDocuments({ category: 'Ethical Mental Health Marketing' });
    const totalClinic = await SocialTemplate.countDocuments({ category: 'Healthcare & Clinic' });
    const totalAll = await SocialTemplate.countDocuments();
    console.log(`Total 'Ethical Mental Health Marketing' templates: ${totalEthical}`);
    console.log(`Total 'Healthcare & Clinic' templates: ${totalClinic}`);
    console.log(`Total templates overall: ${totalAll}`);

    await mongoose.disconnect();
    console.log('Successfully completed seeding.');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
