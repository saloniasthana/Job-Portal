export const formatSalary = (min, max, currency = 'INR') => {
  if (!min && !max) return 'Not disclosed';
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : `${currency} `;
  const fmt = (n) => {
    if (currency === 'INR') {
      if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
      return n.toLocaleString('en-IN');
    }
    if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
    return n.toString();
  };
  if (min && max) return `${symbol}${fmt(min)} – ${symbol}${fmt(max)}`;
  return `${symbol}${fmt(min || max)}+`;
};

export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [name, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

export const jobTypeLabels = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
};

export const workModeLabels = {
  onsite: 'On-site',
  remote: 'Remote',
  hybrid: 'Hybrid',
};

export const jobCategories = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Science',
  'DevOps',
  'UI/UX Design',
  'Product Management',
  'QA / Testing',
  'Marketing',
  'Sales',
  'Other',
];
