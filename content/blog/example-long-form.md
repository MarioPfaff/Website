---
title: "Example post: how long-form writing looks on this site"
description: "Placeholder text for checking typography and spacing. Delete before publishing."
category: uncategorized
tags: [example, design]
date: "2026-11-15"
draft: true
---

This is an example post. It exists only so the layout can be judged with a realistic amount of text, and it should be deleted (or set back to `draft: true`) before the site is published. Everything below is placeholder writing about a neutral topic, chosen because it gives the page the kind of rhythm a real post would have: a few long paragraphs, some headings, a list, a quote, a bit of code and a table.

The topic is slow design: interfaces that take their time, borrow the warmth of analogue media and ask the reader to settle in rather than skim. It is a reasonable subject for a test page because it naturally mixes argument, examples and asides, which is exactly what a personal blog tends to do.

## Why slowness can feel good

Most of the web is built for speed. Pages compete for a few seconds of attention, so they front-load the point, shout the headline and push everything else below the fold. That is often the right choice for a shop or a news site. A personal site has a different job. Nobody arrives at a personal blog by accident; they came to read, and a slower, calmer page can signal that the writing is meant to be read properly.

Slowness here does not mean sluggishness. Pages should still load quickly, links should respond immediately and nothing should get in the way of the text. The slowness is in the atmosphere: colours that shift gradually, light that drifts rather than flashes, and enough space around each paragraph that the eye never feels crowded.

There is a long tradition behind this idea. Printed books have always been designed for sustained reading, and their conventions (generous margins, a comfortable line length, a typeface that disappears into the words) were refined over centuries. Screens have different constraints, but the basic needs of a reader have not changed very much.

## What makes something feel lo-fi

"Lo-fi" started as a description of sound: recordings with tape hiss, slightly wobbly pitch and a narrow, warm frequency range. The visual version borrows the same qualities and translates them:

- **Grain** stands in for tape hiss. A faint noise texture over everything makes flat digital colour feel more physical.
- **Muted, warm colour** replaces saturated brand colours. Think faded film stock rather than a fresh screen.
- **Soft focus** comes from blur and gentle gradients instead of hard edges and sharp shadows.
- **Imperfect timing** gives motion a human feel. Nothing moves at a perfectly constant speed; it drifts, hesitates and picks up again.

None of these is decoration for its own sake. Each one lowers the visual temperature of the page a little, and together they make it feel less like an interface and more like a place.

> A good reading environment is one you stop noticing after the first paragraph. The mood should be there when you look up from the text, and quietly absent while you read.

That quote is invented for this example, but it describes the balance a site like this has to strike. The background is allowed to be beautiful, as long as it never competes with the sentence the reader is in the middle of.

## The parts that matter most for reading

When a page carries this much atmosphere, the plain typographic decisions matter even more. The text is the one thing that has to stay steady while everything around it moves.

### Line length

Lines that are too long make the eye lose its place when it jumps back to the start of the next line. Lines that are too short break the rhythm of reading and make every sentence feel choppy. A common target for long-form text is somewhere around sixty to seventy characters per line, which is roughly the width of this paragraph if the layout is doing its job.

### Size and spacing

Body text on screens is usually most comfortable somewhere between sixteen and twenty-odd pixels, depending on the typeface. Some faces run small for their nominal size and need a bump. Line spacing needs to be loose enough that lines do not crowd each other, but not so loose that each line floats away from its neighbours.

### Contrast

Text has to stand clearly apart from whatever is behind it. On a plain background that is easy to check. On a background that moves and changes colour, every colour the text might pass over has to be considered, not just the average.

## A small technical aside

Posts on this site are written in Markdown, so code samples are easy to include. Here is a short example of the kind of thing a project note might contain, in this case a tiny smoothing function of the sort used to keep a control from jumping:

```cpp
// One-pole low-pass filter: smooths a jumpy input value.
float smooth(float previous, float target, float amount) {
  return previous + (target - previous) * amount;
}
```

Inline code, such as `smooth(previous, target, 0.1f)`, should sit comfortably within a sentence without breaking the line height. Longer blocks like the one above should be readable without the background showing through too strongly.

## A comparison in table form

Tables are less common in personal writing, but they appear in project notes often enough that they are worth checking too.

| Quality | Fast, high-fidelity page | Slow, lo-fi page |
| --- | --- | --- |
| Colour | Saturated, high contrast | Muted, warm, faded |
| Motion | Quick, purposeful transitions | Gentle, uneven drift |
| Texture | Clean, flat surfaces | Grain and soft blur |
| Goal | Get the reader to act | Let the reader settle in |

## How a post usually ends

Personal posts rarely end with a tidy conclusion. More often they trail off into a list of open questions, a note about what comes next or a link to something related. That is fine; the end of a post is a natural place for the page to breathe out.

For this example, the useful ending is a checklist for reviewing the layout:

1. Read a full paragraph and notice whether the moving light ever pulls your eye away from the text.
2. Check that headings, quotes, code and the table all feel like part of the same design.
3. Scroll to the bottom and see whether the page ends gracefully or just stops.
4. Try it in both the light and the dark theme, and on a phone.

Once that review is done, this file can be deleted from `content/blog/`.
