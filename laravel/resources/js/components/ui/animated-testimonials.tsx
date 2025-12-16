"use client";

import { IconArrowLeft, IconArrowRight, IconQuote, IconStar, IconStarFilled } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  rating: number;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => setActive((p) => (p + 1) % testimonials.length);
  const handlePrev = () => setActive((p) => (p - 1 + testimonials.length) % testimonials.length);
  const isActive = (i: number) => i === active;

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(handleNext, 5000);
    return () => clearInterval(id);
  }, [autoplay]);

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  const renderStars = (count: number) => {
    return (
      <div className="mt-2 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) =>
          i < count ? (
            <IconStarFilled key={i} className="h-4 w-4 text-yellow-500" />
          ) : (
            <IconStar key={i} className="h-4 w-4 text-yellow-500/50" />
          ),
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-sm p-14 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative z-0 grid grid-cols-1 gap-15 md:grid-cols-2">
        {/* Left: Image stack */}
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.src}
                  initial={{ opacity: 0, scale: 0.9, z: -100, rotate: randomRotateY() }}
                  animate={{
                    opacity: isActive(i) ? 1 : 0.7,
                    scale: isActive(i) ? 1 : 0.95,
                    z: isActive(i) ? 0 : -100,
                    rotate: isActive(i) ? 0 : randomRotateY(),
                    zIndex: isActive(i) ? 40 : testimonials.length + 2 - i,
                    y: isActive(i) ? [0, -80, 0] : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.9, z: 100, rotate: randomRotateY() }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={t.src}
                    alt={t.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center shadow-xl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Text */}
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* nama + role */}
            <h3 className="text-2xl font-bold text-black">{testimonials[active].name}</h3>
            <p className="text-sm text-gray-500">{testimonials[active].designation}</p>

            {/* rating */}
            {renderStars(testimonials[active].rating)}

            {/* quote */}
            <div className="relative mt-8">
              <IconQuote className="absolute -left-3 -top-3 h-6 w-6 text-[#266055]/50" />
              <motion.p className="pl-6 text-md text-gray-600">
                {testimonials[active].quote.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * i }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </div>
          </motion.div>

          {/* controls + dots */}
          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                aria-label="Sebelumnya"
                className="group/button flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-[#266055]/20 hover:cursor-pointer"
              >
                <IconArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Berikutnya"
                className="group/button flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-[#266055]/20 hover:cursor-pointer"
              >
                <IconArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12" />
              </button>
            </div>

            {/* pagination dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Ke testimonial ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    isActive(i) ? "w-6 bg-[#266055]" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
