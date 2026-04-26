import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

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
    <div style={{ paddingTop: '140px', paddingLeft: '24px', paddingRight: '24px', maxWidth: '900px', margin: '0 auto', minHeight: '80vh', paddingBottom: '100px' }}>
      
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <span style={{ fontSize: '10px', color: '#00dc6e', letterSpacing: '2px' }}>●</span>
          <span className="font-inter uppercase" style={{ fontSize: '11px', letterSpacing: '4px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
            {t('hiw.eyebrow', 'SIMPLE GUIDE')}
          </span>
        </div>
        <h1 className="font-clash" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '900', color: '#ffffff', marginBottom: '24px', textTransform: 'uppercase', lineHeight: '1.1' }}>
          {t('hiw.title', 'HOW IT WORKS')}
        </h1>
        <p className="font-inter" style={{ fontSize: '20px', color: '#00dc6e', lineHeight: '1.6', marginBottom: '16px', maxWidth: '700px', fontWeight: '500' }}>
          {t('hiw.subtitle1', 'Think of TrustChain as an unfakeable digital report card.')}
        </p>
        <p className="font-inter" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8', marginBottom: '60px', maxWidth: '700px' }}>
          {t('hiw.subtitle2', 'Usually, if a plumber or electrician does a great job, only the person who hired them knows. With TrustChain, every good job gets a "gold star" review that is locked in a public digital notebook (called a blockchain). No one can delete it, and no one can fake it.')}
        </p>
      </motion.div>

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        {/* For Workers Section */}
        <div style={{ marginBottom: '80px' }}>
          <motion.h2 variants={fadeIn} className="font-clash" style={{ fontSize: '24px', color: '#ffffff', marginBottom: '32px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
            {t('hiw.workers.title', '01. FOR WORKERS (BUILDING YOUR RESUME)')}
          </motion.h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <motion.div variants={fadeIn} style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="font-inter" style={{ color: '#00dc6e', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>STEP 1</h3>
              <h4 className="font-clash" style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>{t('hiw.workers.step1.title', 'Get Your Digital Key')}</h4>
              <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                {t('hiw.workers.step1.desc', 'You don\'t need an email or a password. You just download a digital wallet (like Freighter). This wallet acts as your unique key to log into TrustChain.')}
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="font-inter" style={{ color: '#00dc6e', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>STEP 2</h3>
              <h4 className="font-clash" style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>{t('hiw.workers.step2.title', 'Do Great Work')}</h4>
              <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                {t('hiw.workers.step2.desc', 'Go out and do your job in the real world just like you normally do. Fix the pipe, build the wall, or paint the house.')}
              </p>
            </motion.div>

            <motion.div variants={fadeIn} style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="font-inter" style={{ color: '#00dc6e', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>STEP 3</h3>
              <h4 className="font-clash" style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>{t('hiw.workers.step3.title', 'Collect Your Stars')}</h4>
              <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                {t('hiw.workers.step3.desc', 'After the job, the person who hired you gives you a rating. This rating is permanently glued to your digital profile so future customers can see how amazing you are.')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* For Verifiers Section */}
        <div style={{ marginBottom: '80px' }}>
          <motion.h2 variants={fadeIn} className="font-clash" style={{ fontSize: '24px', color: '#ffffff', marginBottom: '32px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
            {t('hiw.verifiers.title', '02. FOR EMPLOYERS (HIRING PEOPLE)')}
          </motion.h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <motion.div variants={fadeIn} style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="font-inter" style={{ color: '#00dc6e', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>STEP 1</h3>
              <h4 className="font-clash" style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>{t('hiw.verifiers.step1.title', 'Find The Best People')}</h4>
              <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                {t('hiw.verifiers.step1.desc', 'Search through our list of workers. You can see what kind of jobs they do and what their overall score is.')}
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="font-inter" style={{ color: '#00dc6e', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>STEP 2</h3>
              <h4 className="font-clash" style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>{t('hiw.verifiers.step2.title', 'Trust The Reviews')}</h4>
              <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                {t('hiw.verifiers.step2.desc', 'Unlike normal websites where anyone can write fake 5-star reviews, every review on TrustChain is verified and locked. You know you are looking at real work history.')}
              </p>
            </motion.div>

            <motion.div variants={fadeIn} style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="font-inter" style={{ color: '#00dc6e', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '16px' }}>STEP 3</h3>
              <h4 className="font-clash" style={{ color: '#ffffff', fontSize: '18px', marginBottom: '12px' }}>{t('hiw.verifiers.step3.title', 'Leave Your Review')}</h4>
              <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                {t('hiw.verifiers.step3.desc', 'When the worker finishes your job, you leave a review. This rewards them for their hard work and helps the next person know they are reliable.')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Platform Navigation Guide */}
        <div style={{ marginBottom: '80px' }}>
          <motion.h2 variants={fadeIn} className="font-clash" style={{ fontSize: '24px', color: '#ffffff', marginBottom: '32px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
            {t('hiw.pages.title', '03. WHAT DOES EACH PAGE DO?')}
          </motion.h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            <motion.div variants={fadeIn} style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#00dc6e', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></div>
              <div>
                <h4 className="font-clash" style={{ color: '#ffffff', fontSize: '18px', marginBottom: '8px' }}>{t('hiw.pages.findWorkers.title', 'Find Workers')}</h4>
                <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                  {t('hiw.pages.findWorkers.desc', 'The main directory. Go here to search for plumbers, electricians, or builders, and read their verified reviews.')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#00dc6e', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></div>
              <div>
                <h4 className="font-clash" style={{ color: '#ffffff', fontSize: '18px', marginBottom: '8px' }}>{t('hiw.pages.workerPortal.title', 'Worker Portal')}</h4>
                <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                  {t('hiw.pages.workerPortal.desc', 'Your personal setup page. If you are a worker, you go here to register your skills and update your profile.')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#00dc6e', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></div>
              <div>
                <h4 className="font-clash" style={{ color: '#ffffff', fontSize: '18px', marginBottom: '8px' }}>{t('hiw.pages.dashboard.title', 'Dashboard')}</h4>
                <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                  {t('hiw.pages.dashboard.desc', 'Your private control center. View your wallet status, recent activity, and reputation score all in one place.')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#00dc6e', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></div>
              <div>
                <h4 className="font-clash" style={{ color: '#ffffff', fontSize: '18px', marginBottom: '8px' }}>{t('hiw.pages.analytics.title', 'Analytics')}</h4>
                <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                  {t('hiw.pages.analytics.desc', 'The big picture. Look here to see platform-wide stats like how many workers are registered and how many total reviews exist.')}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px', alignItems: 'flex-start', gridColumn: '1 / -1' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#00dc6e', borderRadius: '50%', marginTop: '8px', flexShrink: 0 }}></div>
              <div>
                <h4 className="font-clash" style={{ color: '#ffffff', fontSize: '18px', marginBottom: '8px' }}>{t('hiw.pages.explorer.title', 'Explorer')}</h4>
                <p className="font-inter" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.6' }}>
                  {t('hiw.pages.explorer.desc', 'The raw blockchain notebook. If you want to dive deep and verify the actual transaction records stored on Stellar, you search here.')}
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Technical Summary */}
        <motion.div variants={fadeIn} style={{ padding: '40px', backgroundColor: 'rgba(0, 220, 110, 0.03)', border: '1px solid rgba(0, 220, 110, 0.1)', marginTop: '40px' }}>
          <h2 className="font-clash" style={{ fontSize: '20px', color: '#00dc6e', marginBottom: '16px', textTransform: 'uppercase' }}>
            {t('hiw.tech.title', 'Why is this safe and free?')}
          </h2>
          <p className="font-inter" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: '1.8' }}>
            {t('hiw.tech.desc', 'TrustChain is built on top of a powerful computer network called Stellar. Think of Stellar as a giant, unbreakable digital safe. Once a review is put into the safe, nobody can change it or cheat the system. Best of all, we made it completely free to use—workers never have to pay money to collect their well-earned reviews.')}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HowItWorks;
