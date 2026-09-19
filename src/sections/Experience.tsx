import { motion } from 'framer-motion'
import { Coffee, Heart, Users, Sparkles } from 'lucide-react'

const experiences = [
  {
    icon: Coffee,
    title: 'Slow Mornings',
    text: 'Start the day with a hot coffee or a cold brew. No rush, just good company and better flavours.',
  },
  {
    icon: Heart,
    title: 'Crafted with Care',
    text: 'Every pizza, every burger, every shake is made fresh. We believe good food takes a little extra love.',
  },
  {
    icon: Users,
    title: 'Conversations Over Coffee',
    text: 'Whether it’s a catch-up with friends or a quiet work session, our space is designed for connection.',
  },
  {
    icon: Sparkles,
    title: 'Celebrations & Parties',
    text: 'Special offers for birthdays and gatherings. Make your moments a little more memorable with us.',
  },
]

export default function Experience() {
  return (
    <section className="py-24 lg:py-32 bg-blueberry-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blueberry-400 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-blueberry-300 text-sm font-medium tracking-widest uppercase"
          >
            The Experience
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl mt-3"
          >
            Not just a café.
            <span className="block italic font-accent text-blueberry-200">A feeling.</span>
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:bg-blueberry-600 transition-colors duration-300">
                <exp.icon size={22} className="text-blueberry-200 group-hover:text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{exp.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{exp.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
