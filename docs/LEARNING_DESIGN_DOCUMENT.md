# CodeExplorer learning design document

**Status:** Draft for supervisor and source review  
**Target group:** Learners aged 10–15 with no or little programming experience  
**Scope:** Design 15 levels; implement and evaluate a justified subset for the bachelor's thesis.

## Product principle

> **A level is complete only when the learner creates and executes a program.
> Reading, sorting, selecting, or answering alone is not programming.**

CodeExplorer is a game-based, block-programming learning platform. Its purpose
is to guide beginners from first algorithmic thinking to a small self-created
interactive program. The contribution is a traceable learning design, not a
collection of unrelated games.

## Learning design process

Every level follows the same development process:

```text
Scientific foundation
        ↓
Learning objective
        ↓
Educational principle
        ↓
Game mechanic and story
        ↓
Programming challenge
        ↓
Assessment
        ↓
Feedback
        ↓
Reward
        ↓
Learning outcome
```

## Rules for every level

Every level must:

- teach one primary programming concept;
- reuse relevant concepts learned in previous levels;
- contain an executable block-programming task;
- provide immediate visual feedback after execution;
- allow retries and support learning through experimentation;
- use clear, age-appropriate language for learners aged 10–15;
- include a mission-specific success check, not only answer matching;
- contribute knowledge or a skill that can be reused in the final project;
- be mapped to a verified CSTA standard identifier before thesis submission.

## Shared interaction model

All levels use the same basic interaction model to reduce interface learning:

```text
Story and mission → block toolbox and workspace → Run → simulation → feedback → retry or next level
```

The implementation should provide a common coding engine with a block
workspace, a restricted toolbox, Run and Reset controls, a mission-specific
simulation, deterministic validation, hints, and progress events. Blockly is a
candidate implementation, subject to an accessibility and technical review.

## Learning path overview

| World                             | Levels | Main focus                                         |
| --------------------------------- | ------ | -------------------------------------------------- |
| World 1 — Think Like a Programmer | 1–3    | Algorithms, sequence, and Boolean reasoning        |
| World 2 — Make Smart Decisions    | 4–6    | Operators and conditional behaviour                |
| World 3 — Store Information       | 7–9    | Variables, data types, and loops                   |
| World 4 — Solve Bigger Problems   | 10–12  | Nested loops and planning representations          |
| World 5 — Become a Game Developer | 13–15  | Decomposition, functions, and creative application |

## Level 1 — Robot Maze

### 1. Programming concept

Algorithms and ordered movement commands.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners understand that a computer executes instructions in a fixed order.
Learners can create and execute their first block-based program.

### 4. Educational principle

Learning by doing, scaffolding, immediate feedback, and cognitive-load
reduction.

### 5. Why this concept?

Algorithms and sequences are prerequisites for conditions, loops, variables,
and functions. Learners must first understand that instructions are executed
one after another.

### 6. Why this game?

A maze makes each movement command visible. Learners can directly observe how
the robot position changes after every instruction without first learning
technical vocabulary.

### 7. Story

Tom must find Jerry in a maze. Help Tom reach Jerry safely.

### 8. UI / UX

- Left: Tom, Jerry, maze, and mission target.
- Right: toolbox and workspace.
- Bottom: Run, Reset, and Hint buttons.

### 9. Programming challenge

The learner constructs a movement program, runs it in the maze, observes the
result, and revises the blocks if Tom does not reach Jerry.

### 10. Programming blocks

`move forward`, `turn left`, `turn right`.

### 11. Assessment

Tom reaches Jerry without moving into a wall. The mission checks the executed
path, not just the block count.

### 12. Feedback

- “Tom hit a wall. Try turning before moving forward.”
- “Tom stopped before reaching Jerry. Add another command.”
- “Great route! Tom reached Jerry.”

### 13. Reward

XP, “First Program” badge, completion animation, and Level 2 unlock.

### 14. Learning outcome

The learner understands sequential execution and has created an executable
program from movement blocks.

## Level 2 — Pizza Builder

### 1. Programming concept

Sequence.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners understand that changing the order of instructions changes a program's
result. Learners can construct a correct sequence of actions.

### 4. Educational principle

Learning by doing, concrete representation, immediate feedback, and
scaffolding.

### 5. Why this concept?

Sequence is the foundation of all executable programs and reinforces the
algorithmic idea from Level 1 in a different context.

### 6. Why this game?

Preparing a pizza is a familiar process with visible dependencies: dough must
be prepared before ingredients can be added and the pizza must be ready before
it is baked.

### 7. Story

The kitchen is busy. Program the pizza station so it prepares the customer's
order correctly.

### 8. UI / UX

- Left: ingredient station, pizza, and cooking animation.
- Right: action-block toolbox and sequence workspace.
- Bottom: Run, Reset, and Hint buttons.

### 9. Programming challenge

The learner drags pizza-action blocks into the workspace, runs the program,
and corrects the sequence using the animation feedback.

### 10. Programming blocks

`prepare dough`, `add sauce`, `add cheese`, `bake pizza`.

### 11. Assessment

The executed program must prepare the pizza in the required order. The game
identifies the first action that cannot be performed.

### 12. Feedback

- “The sauce needs dough first. Move ‘prepare dough’ earlier.”
- “The pizza is not ready to bake yet. Check the ingredient order.”
- “Order complete! The pizza is ready.”

### 13. Reward

XP, “Sequence Chef” badge, completion animation, and Level 3 unlock.

### 14. Learning outcome

The learner can explain that computers execute instructions in order and can
create a correct executable sequence.

## Level 3 — Treasure Chest

### 1. Programming concept

Boolean values: true and false.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners understand that a condition has a true or false value and can use one
to control a simple program decision.

### 4. Educational principle

Concrete-to-abstract learning, scaffolding, and immediate feedback.

### 5. Why this concept?

Boolean values are the basis for logical operators and conditionals in later
levels.

### 6. Why this game?

A treasure chest creates a clear binary outcome: it is safe to open or it is
not. The result is visible and meaningful in the game world.

### 7. Story

Find safe treasure chests in an ancient vault without triggering a trap.

### 8. UI / UX

- Left: chest, safety indicator, and vault animation.
- Right: Boolean-condition workspace with a small toolbox.
- Bottom: Run, Reset, and Hint buttons.

### 9. Programming challenge

The learner places a provided Boolean condition inside a simple `if` structure
and executes the chest-opening program.

### 10. Programming blocks

`if`, `chest is safe`, `open chest`.

### 11. Assessment

The program opens safe chests and leaves unsafe chests closed in several
scenario tests.

### 12. Feedback

- “This chest is not safe. Your condition should prevent opening it.”
- “The chest was safe, but your program did not open it.”
- “Correct decision! You opened only safe treasure.”

### 13. Reward

XP, “Logic Scout” badge, treasure animation, and Level 4 unlock.

### 14. Learning outcome

The learner can identify true and false conditions and use a Boolean value in
an executable decision.

## Level 4 — Castle Gate

### 1. Programming concept

Logical AND.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners understand that an AND expression is true only when both conditions
are true.

### 4. Educational principle

Scaffolding, contrastive examples, and immediate visual feedback.

### 5. Why this concept?

AND builds on Boolean values and prepares learners to build complete
conditional expressions.

### 6. Why this game?

A castle gate naturally requires two credentials. Learners can see why one
correct requirement is not enough.

### 7. Story

Enter the castle only when the hero has both the key and the royal pass.

### 8. UI / UX

- Left: hero, gate, key, pass, and status indicators.
- Right: condition workspace and block toolbox.
- Bottom: Run, Reset, and scenario selector.

### 9. Programming challenge

The learner builds an `if` condition containing an AND expression and runs it
against different key and pass scenarios.

### 10. Programming blocks

`if`, `and`, `has key`, `has pass`, `open gate`.

### 11. Assessment

The gate opens only when the hero has both items across all scenario tests.

### 12. Feedback

- “The hero has a key but no pass. Both conditions are required.”
- “The gate opened without both items. Check the AND block.”
- “Gate secured and opened correctly!”

### 13. Reward

XP, “Gatekeeper” badge, gate-opening animation, and Level 5 unlock.

### 14. Learning outcome

The learner can construct and test a logical AND expression.

## Level 5 — Escape Route

### 1. Programming concept

Logical OR.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners understand that an OR expression is true when at least one condition
is true.

### 4. Educational principle

Contrastive learning, scaffolding, and immediate feedback.

### 5. Why this concept?

OR is introduced after AND so learners can compare two common ways of combining
Boolean conditions before using them in larger conditional programs.

### 6. Why this game?

An escape route can be safe for more than one reason, making “either/or”
observable in a single mission.

### 7. Story

Escape the ruins by following a route when the hero has a map or can see a
rescue beacon.

### 8. UI / UX

- Left: hero, two possible routes, map, and beacon states.
- Right: condition workspace and toolbox.
- Bottom: Run, Reset, and scenario selector.

### 9. Programming challenge

The learner creates an OR expression inside a conditional and runs it on route
scenarios where neither, one, or both conditions are true.

### 10. Programming blocks

`if`, `or`, `has map`, `sees beacon`, `take safe route`.

### 11. Assessment

The hero takes the safe route when at least one condition is true and waits
when neither is true.

### 12. Feedback

- “The map is enough to find the route. One true condition should work.”
- “Neither clue is available. The hero should wait.”
- “Smart escape! Your OR condition works.”

### 13. Reward

XP, “Route Finder” badge, escape animation, and Level 6 unlock.

### 14. Learning outcome

The learner can distinguish OR from AND and create an executable OR condition.

## Level 6 — Monster Adventure

### 1. Programming concept

If and if/else statements.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners can use a condition to select an appropriate action in a changing game
state.

### 4. Educational principle

Learning by doing, scaffolding, iteration, and immediate feedback.

### 5. Why this concept?

Learners now have Boolean, AND, and OR blocks. Conditionals combine these
concepts into meaningful program behaviour.

### 6. Why this game?

An adventure scene provides clear alternative actions: avoid a monster, collect
an item, or continue along a safe path.

### 7. Story

Guide the hero through a cave. Program a safe response whenever a monster
appears.

### 8. UI / UX

- Left: hero, cave path, monster, and item states.
- Right: workspace with condition and action blocks.
- Bottom: Run, Reset, Hint, and scenario selector.

### 9. Programming challenge

The learner builds an `if/else` program that chooses the correct action for
each game state and tests it in several runs.

### 10. Programming blocks

`if/else`, known Boolean and operator blocks, `hide`, `collect`, `move forward`.

### 11. Assessment

The program must select correct actions for all provided scenarios, including
both branches of the conditional.

### 12. Feedback

- “A monster appeared, but the hero kept walking. Add an action to the if branch.”
- “The path was clear. Check what happens in the else branch.”
- “Your hero reacts safely in every situation!”

### 13. Reward

XP, “Decision Maker” badge, cave-clear animation, and Level 7 unlock.

### 14. Learning outcome

The learner can create and test a conditional program with alternative actions.

## Level 7 — Coin Collector

### 1. Programming concept

Variables.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners can create, initialize, and update a variable that stores a changing
number.

### 4. Educational principle

Concrete representation, learning by doing, and immediate feedback.

### 5. Why this concept?

After programming behaviour with conditions, learners need a way to remember
and change information during a program.

### 6. Why this game?

Collecting coins gives a visible meaning to a changing number and makes a
variable's state easy to inspect.

### 7. Story

Collect coins in the ruins and program the score counter correctly.

### 8. UI / UX

- Left: player, collectible coins, and live score display.
- Right: variable workspace and toolbox.
- Bottom: Run, Reset, and test scenario selector.

### 9. Programming challenge

The learner initializes a `coins` variable and updates it when coins are
collected. The program is executed with different coin values.

### 10. Programming blocks

`set coins to`, `change coins by`, `coins`, number blocks, and known action
blocks.

### 11. Assessment

The score starts correctly and ends with the expected total in each test
scenario.

### 12. Feedback

- “The score starts with the wrong value. Initialize `coins` first.”
- “A coin was collected, but the score did not change.”
- “Score updated correctly!”

### 13. Reward

XP, “Score Keeper” badge, coin burst animation, and Level 8 unlock.

### 14. Learning outcome

The learner can use a variable to store and update changing information.

## Level 8 — Backpack Inventory

### 1. Programming concept

Data types: text, numbers, and Boolean values.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners can identify and use appropriate value types in a program.

### 4. Educational principle

Scaffolding, concrete representation, and immediate feedback.

### 5. Why this concept?

Variables become more useful when learners understand that stored values can
represent names, quantities, and true/false states.

### 6. Why this game?

An inventory naturally contains item names, quantities, and ownership states,
so each data type has a clear purpose.

### 7. Story

Pack the hero's inventory with the correct item information before an
expedition.

### 8. UI / UX

- Left: backpack, item cards, and inventory display.
- Right: value blocks, variable blocks, and workspace.
- Bottom: Run, Reset, and Hint buttons.

### 9. Programming challenge

The learner assigns text, number, and Boolean values to inventory variables and
runs the packing program.

### 10. Programming blocks

`set variable to`, text blocks, number blocks, `true`, `false`, and inventory
variables.

### 11. Assessment

The executed inventory must contain the required name, quantity, and ownership
state with compatible value types.

### 12. Feedback

- “The item name needs text, not a number.”
- “The number of potions is missing.”
- “Inventory complete! Every value has the right type.”

### 13. Reward

XP, “Data Organizer” badge, packed-backpack animation, and Level 9 unlock.

### 14. Learning outcome

The learner can select and use text, number, and Boolean values in variables.

## Level 9 — Robot Cleaner

### 1. Programming concept

Loops.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners can use a loop to replace repeated instructions with a shorter
program.

### 4. Educational principle

Pattern recognition, scaffolding, immediate feedback, and debugging.

### 5. Why this concept?

Learners can already create sequences and make decisions. Loops now show how a
program can express repeated patterns efficiently.

### 6. Why this game?

A robot cleaning repeated tiles makes repetition obvious and lets learners
compare repeated commands with a compact loop.

### 7. Story

Program a cleaning robot to clear every tile in a corridor before its battery
runs out.

### 8. UI / UX

- Left: robot, dirty tiles, battery indicator, and route preview.
- Right: workspace with sequence and loop blocks.
- Bottom: Run, Reset, and Hint buttons.

### 9. Programming challenge

The learner replaces repeated movement-and-clean actions with a `repeat` block,
runs the robot, and refines the loop count.

### 10. Programming blocks

`repeat`, number block, `move forward`, `clean tile`.

### 11. Assessment

All tiles must be cleaned, the robot must remain in bounds, and the mission
requires a loop block rather than only duplicated actions.

### 12. Feedback

- “Two tiles are still dirty. Increase the repeat count.”
- “The robot moved too far. Check the number inside the loop.”
- “Efficient cleaning! Your loop cleared the corridor.”

### 13. Reward

XP, “Loop Builder” badge, clean-corridor animation, and Level 10 unlock.

### 14. Learning outcome

The learner can recognize repetition and use a loop to create a shorter
executable program.

## Level 10 — Garden Builder

### 1. Programming concept

Nested loops.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners can combine two loops to create a repeated two-dimensional pattern.

### 4. Educational principle

Scaffolding, pattern recognition, worked examples, and immediate feedback.

### 5. Why this concept?

Nested loops extend the single-loop model from Level 9 and introduce a larger
program structure without adding unrelated concepts.

### 6. Why this game?

Planting rows of flowers makes an outer repetition of rows and an inner
repetition of tiles visible in the final garden pattern.

### 7. Story

Restore the royal garden by programming a planting robot to create a pattern.

### 8. UI / UX

- Left: garden grid, planting robot, and target pattern.
- Right: nested-loop workspace and toolbox.
- Bottom: Run, Reset, step preview, and Hint buttons.

### 9. Programming challenge

The learner creates an outer row loop and an inner tile loop, then runs the
program to match the target garden pattern.

### 10. Programming blocks

`repeat`, number blocks, `plant flower`, `move forward`, `next row`.

### 11. Assessment

The generated garden must match the required rows and columns and include a
loop inside another loop.

### 12. Feedback

- “The first row is correct, but the next row did not start.”
- “This loop plants one row. Put it inside another loop for all rows.”
- “Garden complete! Your nested loops created the pattern.”

### 13. Reward

XP, “Pattern Architect” badge, garden-growth animation, and Level 11 unlock.

### 14. Learning outcome

The learner can use nested loops to express a repeated two-dimensional pattern.

## Level 11 — Connect the Path

### 1. Programming concept

Flowcharts and algorithm representation.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners can plan an algorithm with ordered process and decision symbols before
implementing it.

### 4. Educational principle

Multiple representations, scaffolding, and learning by doing.

### 5. Why this concept?

Flowcharts help learners make program logic visible before code grows more
complex through decomposition and functions.

### 6. Why this game?

Connecting a path gives flowchart symbols a practical purpose: the learner can
trace how a decision changes the route.

### 7. Story

Plan a delivery drone's route through checkpoints and weather decisions.

### 8. UI / UX

- Left: draggable start, process, decision, and end nodes.
- Right: simplified block preview generated from the chart.
- Bottom: Run Trace, Reset, and Hint buttons.

### 9. Programming challenge

The learner builds a valid flowchart, runs an animated trace, and maps the
planned route to provided program blocks.

### 10. Programming blocks

Flowchart nodes: `start`, `process`, `decision`, `end`; mapped blocks: known
sequence and conditional blocks.

### 11. Assessment

The flowchart must have a valid start and end, connected paths, and correct
behaviour for each decision state.

### 12. Feedback

- “This decision has no route for ‘false’. Connect both outcomes.”
- “The route has no end point. Add an end node.”
- “Clear plan! The drone followed your flowchart.”

### 13. Reward

XP, “Mission Planner” badge, drone-delivery animation, and Level 12 unlock.

### 14. Learning outcome

The learner can represent and trace an algorithm using basic flowchart symbols.

## Level 12 — Mission Planner

### 1. Programming concept

Pseudocode.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners can express an algorithm in precise, structured natural language and
translate it into blocks.

### 4. Educational principle

Multiple representations, scaffolding, and reflection through implementation.

### 5. Why this concept?

Pseudocode bridges visual blocks and independent planning. It prepares learners
to design larger programs before constructing them.

### 6. Why this game?

A mission briefing makes written instructions purposeful: the plan must be
clear enough for a robot teammate to follow.

### 7. Story

Write a mission plan for a rescue robot, then turn the plan into an executable
route.

### 8. UI / UX

- Left: mission briefing and structured pseudocode editor.
- Right: block workspace and simulation preview.
- Bottom: Run, Reset, and “show matching block” help control.

### 9. Programming challenge

The learner completes pseudocode statements, converts each statement to blocks,
and executes the resulting mission program.

### 10. Programming blocks

Known sequence, conditional, loop, and variable blocks; pseudocode templates
for `IF`, `REPEAT`, and action steps.

### 11. Assessment

The block program must fulfil the mission and each pseudocode instruction must
map to an observable part of the executed behaviour.

### 12. Feedback

- “Your plan says to repeat, but the program has no loop.”
- “This instruction is too vague. What should the robot do next?”
- “Mission complete! Your plan and program match.”

### 13. Reward

XP, “Code Planner” badge, mission-complete animation, and Level 13 unlock.

### 14. Learning outcome

The learner can use pseudocode to plan an algorithm and implement it in blocks.

## Level 13 — Build a Castle

### 1. Programming concept

Decomposition.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners can split a large programming task into smaller independently testable
subtasks.

### 4. Educational principle

Problem decomposition, scaffolding, testing, and iteration.

### 5. Why this concept?

Before building a larger final project, learners need a strategy for managing a
problem that cannot be solved comfortably in one workspace at once.

### 6. Why this game?

A castle has recognisable components such as a wall, gate, and tower. Each can
be planned, programmed, and tested separately before forming one result.

### 7. Story

Rebuild a damaged castle by programming its wall, gate, and tower systems.

### 8. UI / UX

- Left: castle progress view with three selectable components.
- Right: task workspace for the selected component.
- Bottom: Test Part, Build Castle, Reset, and Hint buttons.

### 9. Programming challenge

The learner divides the mission into component tasks, creates a program for
each task, tests the parts, and combines them into a complete castle.

### 10. Programming blocks

Previously learned sequence, conditional, loop, variable, and planning blocks.

### 11. Assessment

Each component must pass its own mission test and the combined program must
create the complete castle.

### 12. Feedback

- “The wall is ready, but the gate task still needs a program.”
- “Test the tower separately to find the failing part.”
- “Castle complete! You solved the big task in smaller parts.”

### 13. Reward

XP, “Problem Solver” badge, castle-building animation, and Level 14 unlock.

### 14. Learning outcome

The learner can decompose a larger problem, test subproblems, and combine their
solutions.

## Level 14 — Wizard Spells

### 1. Programming concept

Functions and parameters.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners can define reusable behaviour and call it with different input values.

### 4. Educational principle

Abstraction, reuse, scaffolding, and learning through experimentation.

### 5. Why this concept?

Functions help learners avoid duplicated code and are a direct preparation for
organising the final project.

### 6. Why this game?

A spell can be reused with different directions or distances, making a function
and its parameter values visible through different effects.

### 7. Story

Create reusable wizard spells to light torches and open magical paths.

### 8. UI / UX

- Left: wizard, spell targets, and effect animation.
- Right: function-definition area, main workspace, and parameter blocks.
- Bottom: Run, Test Spell, Reset, and Hint buttons.

### 9. Programming challenge

The learner defines a `cast spell` function, calls it more than once with
different parameter values, and runs the program in multiple scenarios.

### 10. Programming blocks

`define function`, `call function`, parameter blocks, known action and control
blocks.

### 11. Assessment

The program must use a defined function and pass scenarios requiring different
parameter values. Duplicated copies of the function body do not pass the reuse
criterion.

### 12. Feedback

- “The spell works once, but reuse the function for the second torch.”
- “This spell needs a direction value. Add a parameter.”
- “Powerful design! One function works for every target.”

### 13. Reward

XP, “Spell Coder” badge, magic animation, and Level 15 unlock.

### 14. Learning outcome

The learner can define, call, and test a reusable function with parameters.

## Level 15 — Build Your Own Mini Game

### 1. Programming concept

Creative application of algorithms, conditions, loops, variables, and
functions.

### 2. Scientific foundation

**Primary source:** CSTA K–12 Computer Science Standards.  
**Supporting research:** Brennan and Resnick; Code.org; Scratch.

### 3. Learning objective

Learners can plan, create, test, debug, and explain a small interactive
program using previously learned concepts.

### 4. Educational principle

Project-based learning, creativity, iteration, debugging, and learner agency.

### 5. Why this concept?

The final project requires learners to transfer individual concepts into an
independent, meaningful artifact rather than solve a single guided puzzle.

### 6. Why this game?

Creating a mini game gives learners ownership of an outcome they can play,
revise, and explain. It demonstrates the purpose of the earlier levels.

### 7. Story

You are now the game developer. Create a small game mission for another player.

### 8. UI / UX

- Left: project brief, scene preview, and asset/template choices.
- Right: larger workspace with a progressive toolbox.
- Bottom: Run, Test, Save Draft, Reset, and project checklist.

### 9. Programming challenge

The learner selects a small template, plans the game, writes and executes the
blocks, tests behaviour, debugs it, and names the completed project.

### 10. Programming blocks

A controlled selection of prior blocks: movement, events, conditions, loops,
variables, and functions. The exact toolbox depends on the selected template.

### 11. Assessment

The project must execute without a blocking error, include an interaction, use
at least two learned concepts, and meet the chosen mission checklist. A short
learner explanation records intentional design choices.

### 12. Feedback

- “Your game starts, but the player has no goal yet. Add a mission.”
- “Test the score: does it change when the player collects an item?”
- “Your mini game is playable! Try one more improvement before sharing it.”

### 13. Reward

Final XP, “Game Developer” badge, completion celebration, and a local playable
project preview.

### 14. Learning outcome

The learner can independently plan, implement, execute, test, and improve a
small block-based program.

## Current prototype mapping

The existing GL1–GL8 prototypes are useful game-idea prototypes, but most use
selection, sorting, or question-answer interaction rather than learner-written
programs. They must be converted to the programming challenges specified here.

| Existing prototype      | Target level | Required change                                                                             |
| ----------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| GL1: Tom and Jerry maze | 1            | Replace direct controls with ordered movement blocks and a run simulation.                  |
| GL2: pizza order        | 2            | Replace move-up/move-down sorting with draggable instruction blocks and execution feedback. |
| GL4: true or false      | 3            | Replace answer buttons with a constructed Boolean condition.                                |
| GL6: secret gates       | 4            | Replace answer buttons with an AND expression in a conditional.                             |
| No current prototype    | 5            | Create an OR-based escape-route mission.                                                    |
| GL5: if adventure       | 6            | Replace answer buttons with an if/else program and scenario tests.                          |
| GL7: coin count         | 7            | Replace answer entry with variable blocks and a running score.                              |
| GL8: data types         | 8            | Replace answer selection with typed values in an inventory program.                         |
| GL3: treasure loop      | 9            | Replace controlled repeat settings with learner-created loop blocks.                        |

## Decisions requiring supervisor approval

- Confirm the exact CSTA standard identifiers and source editions for every
  level before the document is used as thesis evidence.
- Decide whether the thesis contribution is a design-and-implementation
  prototype, a user study, or both.
- Define evaluation age bands, for example 10–12 and 13–15, so that the broad
  target range is not treated as one homogeneous group.
- Define the feasible implemented and evaluated level subset.
- Review Blockly for accessibility, device support, localization, and technical
  fit before adding it as a dependency.
