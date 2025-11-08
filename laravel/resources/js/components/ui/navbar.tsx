"use client";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Link } from "@inertiajs/react";
import { home } from "@/routes/index"

/* Helper: inject visible only to custom components (bukan DOM) */
const injectVisible = (children: React.ReactNode, visible: boolean) =>
  React.Children.map(children, (child) =>
    React.isValidElement(child) && typeof child.type !== "string"
      ? React.cloneElement(
          child as React.ReactElement<{ visible?: boolean }>,
          { visible },
        )
      : child,
  );

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}
interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}
interface NavItemsProps {
  items: { name: string; link: string }[];
  className?: string;
  onItemClick?: () => void;
  visible?: boolean;
}
interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}
interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}
interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.div ref={ref} className={cn("fixed inset-x-0 top-10 z-[1000] isolate w-full", className)}>
      {injectVisible(children, visible)}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      style={{ minWidth: "800px" }}
      className={cn(
        "relative z-[1000] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full px-4 py-2 lg:flex",
        visible ? "bg-white/80 text-black" : "bg-transparent text-white",
        className,
      )}
    >
      {injectVisible(children, !!visible)}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick, visible }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium transition duration-200 lg:flex lg:space-x-2",
        visible ? "text-zinc-700 hover:text-zinc-900" : "text-white/90 hover:text-white",
        className,
      )}
    >
      {items.map((item, idx) => (
        <Link
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className={cn("relative px-4 py-2", visible ? "text-zinc-700" : "text-white")}
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className={cn(
                "absolute inset-0 h-full w-full rounded-full",
                visible ? "bg-gray-100" : "bg-white/20",
              )}
            />
          )}
          <span className="relative z-100">{item.name}</span>
        </Link>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 50 }}
      className={cn(
        "relative z-[1000] mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between px-0 py-2 lg:hidden",
        visible ? "bg-white/80 text-black" : "bg-transparent text-white",
        className,
      )}
    >
      {injectVisible(children, !!visible)}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children, className, visible }: MobileNavHeaderProps) => {
  return (
    <div className={cn("flex w-full flex-row items-center justify-between", className)}>
      {injectVisible(children, !!visible)}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen }: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-[1000] flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
  visible,
}: {
  isOpen: boolean;
  onClick: () => void;
  visible?: boolean;
}) => {
  const iconClass = visible ? "text-black" : "text-white";
  return isOpen ? <IconX className={iconClass} onClick={onClick} /> : <IconMenu2 className={iconClass} onClick={onClick} />;
};

export const NavbarLogo = ({ visible }: { visible?: boolean }) => {
  return (
    <Link href={home.url()} className="relative z-[1000] mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal">
      <img src="/app-logo.png" alt="logo" width={45} height={45} />
      <span
        className={cn(
          "truncate font-logo text-xl font-bold leading-tight",
          visible ? "text-black" : "text-white",
        )}
      >
        HAMASENSE
      </span>
    </Link>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = Link,
  children,
  className,
  visible,
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
} & (React.ComponentPropsWithoutRef<'a'> | React.ComponentPropsWithoutRef<'button'>)) => {
  const baseStyles =
    'px-4 py-2 rounded-md text-sm font-bold relative cursor-pointer transition duration-200 inline-block text-center';

  // Gaya fix sesuai requirement:
  const styleTop = 'bg-white text-slate-600 hover:bg-white/90';
  const styleScrolled = 'bg-primary text-slate-100 hover:bg-primary/90';

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, visible ? styleScrolled : styleTop, className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
