# CDemo

## Overview

- CDemo ("see-demo", shortening of _Computation Demonstration_) is a
  JavaScript libary for rendering data structure diagrams and 2-dimensional
  plots. The libary is used extensively for rendering the diagrams on
  [Sublimis](https://www.sublimis.xyz), my personal website for math and
  computer science notes.

## Dependencies

- CDemo is built with the D3.js library.
- Some of the CDemo modules rely on CSS I wrote for my website, and I'm now
  in the process of removing these CSS dependencies.

## Currently Work On

- [ ] Refactoring much of the code for greater readability and modularity.
  CDemo was built "on-the-go" &mdash; i.e., as I took notes in class, I
  sketched diagrams by hand, then in the evenings quickly wrote code for
  generating the diagrams with D3. Accordingly, there's a good amount of
  spaghetti code and magic numbers that need to be cleaned. This is a
  long-term process, and I spend a little bit of time each day making
  improvements and optimizations where I see them.
- [ ] Planning a new module for generating 3-dimensional plots. I almost
  exclusively use Python, Mathematica, or LaTeX to create 3-dimensional
  plots, but with ThreeJS's continued performance improvements, I'm now
  taking more seriously the goal of having a dedicated CDemo module for
  3-dimensional plots. Having a single program I can use for rendering all
  the diagrams I need would be a lot more convenient than having to jump
  between different graphics packages.
