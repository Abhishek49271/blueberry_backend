import { motion } from 'framer-motion'

const signatures = [
  {
    title: 'Blueberry Mix Master Pizza',
    price: '₹220 / ₹350',
    desc: 'Our namesake pizza — a special blend of flavours that keeps guests coming back.',
    emoji: '🍕',
    bg: 'from-blueberry-800 to-blueberry-950',
  },
  {
    title: 'Choco Lava Cake',
    price: '₹71',
    desc: 'Warm, molten chocolate centre. The perfect sweet ending to any meal.',
    emoji: '🍫',
    bg: 'from-amber-800 to-stone-900',
  },
  {
    title: 'Maha Veggie Burger',
    price: '₹199',
    desc: 'Double the goodness. Loaded, juicy and unapologetically vegetarian.',
    emoji: '🍔',
    bg: 'from-emerald-800 to-teal-950',
  },
]

export default function Signature() {
  return (
    <section id="signature" className="py-24 lg:py-32 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-blueberry-600 text-sm font-medium tracking-widest uppercase"
          >
            House Specials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl text-blueberry-950 mt-3"
          >
            The Ones Everyone Orders
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {signatures.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${item.bg} text-white p-8 min-h-[320px] flex flex-col justify-between group`}
            >
              <div className="absolute top-6 right-6 text-6xl opacity-20 group-hover:opacity-30 transition-opacity group-hover:scale-110 duration-500">
                {item.emoji}
              </div>
              <div>
                <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Signature</p>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
                  {item.title}
                </h3>
              </div>
              <div>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">{item.desc}</p>
                <p className="font-display text-2xl font-semibold">{item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
