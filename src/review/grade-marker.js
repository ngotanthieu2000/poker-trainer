const REVIEW_MARKERS = {
  Good: { key: 'good', label: 'Tốt' },
  Mistake: { key: 'mistake', label: 'Lỗi' },
  'Major Mistake': { key: 'major-mistake', label: 'Lỗi nặng' },
};

function mapGradeToMarker(grade) {
  return REVIEW_MARKERS[grade] || REVIEW_MARKERS.Mistake;
}

module.exports = {
  mapGradeToMarker,
  REVIEW_MARKERS,
};
