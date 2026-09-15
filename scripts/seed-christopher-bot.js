require('/www/wwwroot/api.siegfriedoutreach.com/node_modules/dotenv').config({ path: '/www/wwwroot/api.siegfriedoutreach.com/.env' });
const { db, connectDB } = require('/www/wwwroot/api.siegfriedoutreach.com/models');
const referenceStudyService = require('/www/wwwroot/api.siegfriedoutreach.com/services/referenceStudyService');

async function updateBot() {
  try {
    await connectDB();
    const bot = await db.Chatbot.findById('6a4ba7c65165b7df2307840f');
    if (!bot) {
      console.error('Chatbot not found!');
      process.exit(1);
    }

    console.log('Crawling https://christophersiegfried.com...');
    let meta = { title: '', textSnippet: '' };
    try {
      meta = await referenceStudyService.scrapeUrl('https://christophersiegfried.com');
    } catch (e) {
      console.warn('Scrape warning:', e.message);
    }

    bot.systemInstruction = `You are Christopher Siegfried's dedicated appointment booking and consultation concierge for Siegfried Marketing (christophersiegfried.com).

Your primary directives:
1. Warmly welcome practice owners, clinicians, and clinic directors.
2. Answer inquiries about our medical clinic and mental health practice marketing services, HIPAA-compliant patient acquisition, and SEO strategies.
3. Whenever a visitor inquires about booking a meeting, scheduling a consultation, discovery call, pricing, or getting started, warmly direct them to book directly on Christopher Siegfried's Calendly: https://calendly.com/christophersiegfried
4. Rely on the verified knowledge base and training data for all answers. Always be ethical, professional, and helpful.`;

    bot.persona = 'default';
    bot.config = {
      model: 'deepseek/deepseek-v4.1-flash',
      temperature: 0.2,
      maxTokens: 2000,
      topP: 1
    };

    bot.trainingData = {
      pdfFiles: [],
      textContent: [
        {
          title: meta.title || 'Ethical Mental Health & Clinic Marketing - Siegfried Marketing',
          content: meta.textSnippet || 'Ethical Medical Clinic & Mental Health Practice Marketing tailored to your clinic and brand. Scale your practice using tailored marketing content: data driven, based on market research, HIPAA compliant, SEO optimized for search engines and AI.',
          addedAt: new Date()
        }
      ],
      qaPairs: [
        {
          question: 'How do I book an appointment or consultation with Christopher Siegfried?',
          answer: 'You can easily schedule a discovery call or consultation directly on Calendly with Christopher Siegfried: https://calendly.com/christophersiegfried',
          addedAt: new Date()
        },
        {
          question: 'What marketing services do you provide for mental health and medical clinics?',
          answer: 'Siegfried Marketing provides ethical, HIPAA-compliant patient acquisition and growth marketing for healthcare and mental health practices, including SEO optimization, data-driven content strategy, clinic scaling, and clinician branding.',
          addedAt: new Date()
        },
        {
          question: 'Is your marketing HIPAA-compliant?',
          answer: 'Yes, absolutely. All marketing strategies, patient communication workflows, and digital outreach campaigns are strictly HIPAA-compliant and tailored specifically for medical clinics and licensed clinicians.',
          addedAt: new Date()
        }
      ]
    };

    await bot.save();
    console.log('Chatbot 6a4ba7c65165b7df2307840f updated successfully with rich training data and system instructions!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating bot:', err);
    process.exit(1);
  }
}

updateBot();
