const REVIEW_MARKERS = {
  Good: { key: 'good', label: 'Good' },
  Mistake: { key: 'mistake', label: 'Mistake' },
  'Major Mistake': { key: 'major-mistake', label: 'Major Mistake' },
};

function mapGradeToMarker(grade) {
  return REVIEW_MARKERS[grade] || REVIEW_MARKERS.Mistake;
}

module.exports = {
  mapGradeToMarker,
  REVIEW_MARKERS,
};
