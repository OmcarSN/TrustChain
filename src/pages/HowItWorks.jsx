import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import HowItWorksBackground from '../components/HowItWorksBackground';

const HowItWorks = () => {
  const { t } = useTranslation();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#05060A', overflow: 'hidden' }}>
      <div className="tc-bg-grid" />
      <div className="tc-orb-green" />
      <div className="tc-orb-blue" />
      {/* Scroll-driven cinematic logo — assembles at centre, flies apart into a watermark */}
      <HowItWorksBackground />
    <div className="tc-page" style={{ position: 'relative', zIndex: 1 }}>
      
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <div className="tc-flex tc-flex-gap-sm tc-mb-lg" style={{ alignItems: 'center' }}>
          <span className="tc-text-accent" style={{ fontSize: '10px', letterSpacing: '2px' }}>●</span>
          <span className="font-inter tc-eyebrow-bright">
            {t('hiw.eyebrow', 'SIMPLE GUIDE')}
          </span>
        </div>
        <h1 className="font-clash tc-heading-hero tc-mb-lg">
          <span className="text-gradient">{t('hiw.title', 'HOW IT WORKS')}</span>
        </h1>
        <p className="font-inter tc-lead tc-mb-md" style={{ maxWidth: '700px' }}>
          {t('hiw.subtitle1', 'Think of TrustChain as an unfakeable digital report card.')}
        </p>
        <p className="font-inter tc-body-lg tc-mb-3xl" style={{ maxWidth: '700px' }}>
          {t('hiw.subtitle2', 'Usually, if a plumber or electrician does a great job, only the person who hired them knows. With TrustChain, every good job gets a "gold star" review that is locked in a public digital notebook (called a blockchain). No one can delete it, and no one can fake it.')}
        </p>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        {/* For Workers Section */}
        <div className="tc-section">
          <motion.h2 variants={fadeIn} className="font-clash tc-heading-section tc-mb-xl">
            {t('hiw.workers.title', '01. FOR WORKERS (BUILDING YOUR RESUME)')}
          </motion.h2>

          <div className="tc-grid-cards">
            <motion.div variants={fadeIn} className="step-card-premium">
              <h3 className="font-inter tc-step-label">STEP 1</h3>
              <h4 className="font-clash tc-heading-sm tc-mb-sm">{t('hiw.workers.step1.title', 'Get Your Digital Key')}</h4>
              <p className="font-inter tc-body">
                {t('hiw.workers.step1.desc', 'You don\'t need an email or a password. You just download a digital wallet (like Freighter). This wallet acts as your unique key to log into TrustChain.')}
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="step-card-premium">
              <h3 className="font-inter tc-step-label">STEP 2</h3>
              <h4 className="font-clash tc-heading-sm tc-mb-sm">{t('hiw.workers.step2.title', 'Verify Your Identity')}</h4>
              <p className="font-inter tc-body">
                {t('hiw.workers.step2.desc', 'Verify your phone number with a one-time passcode. This ensures our platform remains spam-free and builds trust with employers.')}
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="step-card-premium">
              <h3 className="font-inter tc-step-label">STEP 3</h3>
              <h4 className="font-clash tc-heading-sm tc-mb-sm">{t('hiw.workers.step3.title', 'Do Great Work')}</h4>
              <p className="font-inter tc-body">
                {t('hiw.workers.step3.desc', 'Go out and do your job in the real world just like you normally do. Fix the pipe, build the wall, or paint the house.')}
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="step-card-premium">
              <h3 className="font-inter tc-step-label">STEP 4</h3>
              <h4 className="font-clash tc-heading-sm tc-mb-sm">{t('hiw.workers.step4.title', 'Collect Your Stars')}</h4>
              <p className="font-inter tc-body">
                {t('hiw.workers.step4.desc', 'After the job, the person who hired you gives you a rating. This rating is permanently glued to your digital profile so future customers can see how amazing you are.')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* For Verifiers Section */}
        <div className="tc-section">
          <motion.h2 variants={fadeIn} className="font-clash tc-heading-section tc-mb-xl">
            {t('hiw.verifiers.title', '02. FOR EMPLOYERS (HIRING PEOPLE)')}
          </motion.h2>

          <div className="tc-grid-cards">
            <motion.div variants={fadeIn} className="step-card-premium">
              <h3 className="font-inter tc-step-label">STEP 1</h3>
              <h4 className="font-clash tc-heading-sm tc-mb-sm">{t('hiw.verifiers.step1.title', 'Find The Best People')}</h4>
              <p className="font-inter tc-body">
                {t('hiw.verifiers.step1.desc', 'Search through our list of workers. You can see what kind of jobs they do and what their overall score is.')}
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="step-card-premium">
              <h3 className="font-inter tc-step-label">STEP 2</h3>
              <h4 className="font-clash tc-heading-sm tc-mb-sm">{t('hiw.verifiers.step2.title', 'Trust The Reviews')}</h4>
              <p className="font-inter tc-body">
                {t('hiw.verifiers.step2.desc', 'Unlike normal websites where anyone can write fake 5-star reviews, every review on TrustChain is verified and locked. You know you are looking at real work history.')}
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="step-card-premium">
              <h3 className="font-inter tc-step-label">STEP 3</h3>
              <h4 className="font-clash tc-heading-sm tc-mb-sm">{t('hiw.verifiers.step3.title', 'Contact & Hire')}</h4>
              <p className="font-inter tc-body">
                {t('hiw.verifiers.step3.desc', 'Found the right worker? Click "Contact Worker" on their profile to reveal their phone number. Call them directly or message them on WhatsApp to discuss the job and hire them.')}
              </p>
            </motion.div>

            <motion.div variants={fadeIn} className="step-card-premium">
              <h3 className="font-inter tc-step-label">STEP 4</h3>
              <h4 className="font-clash tc-heading-sm tc-mb-sm">{t('hiw.verifiers.step4.title', 'Leave Your Review')}</h4>
              <p className="font-inter tc-body">
                {t('hiw.verifiers.step4.desc', 'When the worker finishes your job, leave a review. This rewards them for their hard work and helps the next person know they are reliable. Each review is sealed on the blockchain forever.')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Platform Navigation Guide */}
        <div className="tc-section">
          <motion.h2 variants={fadeIn} className="font-clash tc-heading-section tc-mb-xl">
            {t('hiw.pages.title', '03. WHAT DOES EACH PAGE DO?')}
          </motion.h2>

          <div className="tc-grid-wide">
            
            <motion.div variants={fadeIn} className="glass-card tc-flex-start tc-flex-gap">
              <div className="tc-dot" style={{ marginTop: '8px' }}></div>
              <div>
                <h4 className="font-clash tc-heading-sm tc-mb-xs">{t('hiw.pages.findWorkers.title', 'Find Workers')}</h4>
                <p className="font-inter tc-body">
                  {t('hiw.pages.findWorkers.desc', 'The main directory. Go here to search for plumbers, electricians, or builders, and read their verified reviews.')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="glass-card tc-flex-start tc-flex-gap">
              <div className="tc-dot" style={{ marginTop: '8px' }}></div>
              <div>
                <h4 className="font-clash tc-heading-sm tc-mb-xs">{t('hiw.pages.workerPortal.title', 'Worker Portal')}</h4>
                <p className="font-inter tc-body">
                  {t('hiw.pages.workerPortal.desc', 'Your personal setup page. If you are a worker, you go here to register your skills and update your profile.')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="glass-card tc-flex-start tc-flex-gap">
              <div className="tc-dot" style={{ marginTop: '8px' }}></div>
              <div>
                <h4 className="font-clash tc-heading-sm tc-mb-xs">{t('hiw.pages.dashboard.title', 'Dashboard')}</h4>
                <p className="font-inter tc-body">
                  {t('hiw.pages.dashboard.desc', 'Your private control center. View your wallet status, recent activity, and reputation score all in one place.')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="glass-card tc-flex-start tc-flex-gap">
              <div className="tc-dot" style={{ marginTop: '8px' }}></div>
              <div>
                <h4 className="font-clash tc-heading-sm tc-mb-xs">{t('hiw.pages.analytics.title', 'Analytics')}</h4>
                <p className="font-inter tc-body">
                  {t('hiw.pages.analytics.desc', 'The big picture. Look here to see platform-wide stats like how many workers are registered and how many total reviews exist.')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="tc-card-sm tc-flex-start tc-flex-gap tc-full-span">
              <div className="tc-dot" style={{ marginTop: '8px' }}></div>
              <div>
                <h4 className="font-clash tc-heading-sm tc-mb-xs">{t('hiw.pages.explorer.title', 'Explorer')}</h4>
                <p className="font-inter tc-body">
                  {t('hiw.pages.explorer.desc', 'The raw blockchain notebook. If you want to dive deep and verify the actual transaction records stored on Stellar, you search here.')}
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Technical Summary */}
        <motion.div variants={fadeIn} className="tc-card-accent tc-mt-xl">
          <h2 className="font-clash tc-heading-md tc-mb-md">
            {t('hiw.tech.title', 'Why is this safe and free?')}
          </h2>
          <p className="font-inter tc-body-lg" style={{ fontSize: '15px' }}>
            {t('hiw.tech.desc', 'TrustChain is built on top of a powerful computer network called Stellar. Think of Stellar as a giant, unbreakable digital safe. Once a review is put into the safe, nobody can change it or cheat the system. Best of all, we made it completely free to use—workers never have to pay money to collect their well-earned reviews.')}
          </p>
        </motion.div>
      </motion.div>
    </div>
    </div>
  );
};

export default HowItWorks;
