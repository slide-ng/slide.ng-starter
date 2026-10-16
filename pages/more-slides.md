# Slides from another file

This slide, and the next one, live in `pages/more-slides.md`.
`slides.md` pulls them in with one line:

```md
---
src: ./pages/more-slides.md
---
```

Use it to split a long talk, or to share slides between decks.

---

# Pick a range

`src: ./pages/more-slides.md#2` imports only slide 2 of that file.
The keys you set on the importing slide, such as `class`, win over the imported ones.
