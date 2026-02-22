# Design Tokens — UX Package Baseline

Version: `v1.0.0`  
Synced date: `2026-02-22`

> Mục đích: định nghĩa token nền cho trạng thái UX Sprint 2. Nếu codebase đã có token tương đương, map 1-1 thay vì tạo trùng.

## Color tokens
- `color.bg.default`
- `color.bg.elevated`
- `color.text.primary`
- `color.text.secondary`
- `color.state.info`
- `color.state.success`
- `color.state.warning`
- `color.state.error`
- `color.border.muted`

## Typography tokens
- `font.family.base`
- `font.size.xs|sm|md|lg`
- `font.weight.regular|medium|semibold`
- `line.height.tight|normal|relaxed`

## Spacing tokens
- `space.2` = 8px
- `space.3` = 12px
- `space.4` = 16px
- `space.6` = 24px
- `space.8` = 32px

## Radius & shadow
- `radius.sm|md|lg`
- `shadow.sm|md`

## Motion tokens
- `motion.fast` = 120ms
- `motion.normal` = 200ms
- `motion.slow` = 300ms
- `easing.standard` = ease-out

## State component tokens
- `banner.info.bg|text|border`
- `banner.error.bg|text|border`
- `banner.warning.bg|text|border`
- `cta.primary.bg|text|hover`
- `cta.secondary.bg|text|border`

## Accessibility baseline
- Contrast text/body >= WCAG AA.
- Focus ring rõ ràng cho CTA keyboard.
- Không dùng màu là tín hiệu duy nhất (phải có label/icon).