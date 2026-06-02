import React from 'react';
import { Calendar, Clock, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const { _id, title, description, image, category, duration, fee, availableSeats, startDate } = course;

  // Format fee to LKR
  const formattedFee = new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(fee);

  // Format Date
  const formattedDate = new Date(startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isFull = availableSeats <= 0;
  const Wrapper = isFull ? 'div' : Link;
  const wrapperProps = isFull
    ? { className: 'glass-card flex flex-col h-full rounded-2xl overflow-hidden shadow-lg bg-slate-950/80' }
    : { to: `/courses/${_id}`, className: 'glass-card flex flex-col h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 group cursor-pointer' };

  return (
    <Wrapper {...wrapperProps}>
      {/* Course Banner Image with Overlay */}
      <div className="relative h-48 overflow-hidden shrink-0 bg-slate-900">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500"
          loading="lazy"
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600/90 text-slate-100 backdrop-blur-sm border border-indigo-500/20">
          {category}
        </span>

        {/* Seat Alert Badge */}
        {isFull ? (
          <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-600/90 text-white backdrop-blur-sm shadow-md">
            Course Full
          </span>
        ) : availableSeats <= 5 ? (
          <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-600/90 text-white backdrop-blur-sm shadow-md animate-pulse">
            Hurry! {availableSeats} Seats Left
          </span>
        ) : (
          <span className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-600/90 text-slate-100 backdrop-blur-sm">
            {availableSeats} Seats Available
          </span>
        )}
      </div>

      {/* Content Details */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-base font-bold text-slate-100 leading-tight group-hover:text-indigo-400 transition-colors line-clamp-1">
            {title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
            <span className="rounded-full bg-slate-900/70 px-2 py-1">{course.level}</span>
            <span className="rounded-full bg-slate-900/70 px-2 py-1">{course.organization}</span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* Course KPIs */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800/40 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Calendar className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Starts: {formattedDate}</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Course Fee</span>
            <span className="text-base font-extrabold text-slate-100 tracking-tight mt-1">{formattedFee}</span>
          </div>

          <span className={`text-xs font-bold flex items-center gap-1 transition-all ${isFull ? 'text-slate-500' : 'text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1'}`}>
            {isFull ? 'Unavailable' : 'View Details →'}
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

export default CourseCard;
