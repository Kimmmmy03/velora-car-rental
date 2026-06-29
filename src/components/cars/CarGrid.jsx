import { motion } from 'framer-motion'
import CarCard from './CarCard'

export default function CarGrid({ cars, onBook }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cars.map((car, index) => (
        <motion.div
          key={car.carId}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: index * 0.06 }}
        >
          <CarCard car={car} onBook={onBook} />
        </motion.div>
      ))}
    </div>
  )
}
