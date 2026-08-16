# CodeExplorer learning design document

**Status:** Draft for supervisor and source review  
**Target group:** Learners aged 10–15 with no or little programming experience  
**Scope:** Design all 15 levels; implement and evaluate a smaller, justified subset for the bachelor's thesis.

## 1. Purpose

CodeExplorer is a game-based, block-programming learning platform that guides
beginners from simple instructions to creating a small interactive program.
The contribution is not a collection of 15 games. It is a traceable learning
design in which every game mechanic, coding task, feedback loop, and assessment
supports a defined learning objective.

The intended learning path is informed by the CSTA K–12 Computer Science
Standards and the computational-thinking framework by Brennan and Resnick.
Scratch, Code.org, and Blockly Games are implementation and interaction
references; they are not copied. Before thesis submission, the author must map
each objective to a verified source edition and exact standard identifier.

## 2. Design principles

1. **Concrete to abstract.** Learners first observe a visible effect, then use
   conditions, repetition, data, abstraction, and creative design.
2. **One principal new concept per level.** Later levels reuse earlier blocks
   rather than introducing several unfamiliar concepts at once.
3. **Learning by doing.** A learner creates, runs, observes, and revises a
   program before receiving the formal concept name.
4. **Scaffolding and fading.** Early levels show a small block palette, worked
   examples, and hints. Later levels remove some guidance and allow more than
   one correct solution.
5. **Formative assessment.** Completion alone is not evidence of learning. The
   platform records whether a program satisfies the mission tests and offers
   actionable feedback after failed attempts.
6. **Age-appropriate challenge.** The visual language must not be childish;
   missions use adventure, strategy, building, and creative-project framing.

## 3. Shared coding-engine model

All coding levels should use one consistent interaction model:

```text
Story and mission → block workspace → Run → visible simulation → feedback → retry or next level
```

The shared engine requires a block workspace, a restricted block toolbox, a
run action, a mission-specific simulation adapter, deterministic validation,
hint/retry states, and progress events. A consistent interface reduces the
need to relearn controls, allowing the learner to focus on the new concept.

Blockly is a candidate implementation for the workspace. It must be evaluated
for accessibility, device support, localization, and dependency cost before it
is added to the application.

## 4. Level matrix

| #   | World and mission                                     | CSTA-aligned learning objective and CT concept                                                                           | Programming challenge and blocks                                                                    | Feedback, assessment, and rationale                                                                                                                                            |
| --- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **World 1: Think Like a Programmer** — Robot Maze     | Create an ordered algorithm that moves a character to a goal. **Concept:** sequence/algorithms.                          | Arrange `move forward`, `turn left`, and `turn right` blocks.                                       | The robot executes the blocks on a visible maze. The goal must be reached without invalid moves. Concrete movement makes instruction order observable.                         |
| 2   | Pizza Builder                                         | Explain and apply the fixed execution order of instructions. **Concept:** sequence.                                      | Arrange action blocks such as `collect dough`, `add sauce`, and `bake`.                             | The pizza animation exposes the first incorrect step; success requires the correct ordered program. A familiar process isolates sequencing from navigation.                    |
| 3   | Treasure Chest                                        | Use a truth value to make a binary program decision. **Concept:** Boolean values/operators.                              | Build a simple `if` condition with a provided Boolean block, such as `chest is safe`.               | The chest opens only for a true condition; the simulation explains the result. A constrained binary choice introduces Boolean reasoning before compound logic.                 |
| 4   | **World 2: Make Smart Decisions** — Castle Gate       | Combine two requirements that must both be true. **Concept:** logical AND.                                               | Compose `has key AND has pass` inside a conditional block.                                          | Several gate states test the program. The gate opens only when both facts are true, making the operator's effect explicit.                                                     |
| 5   | Escape Route                                          | Select a route when either of two requirements is true. **Concept:** logical OR.                                         | Compose `has map OR sees beacon` inside a route decision.                                           | Scenario variations verify that either condition permits the safe route. Contrasting it with Level 4 helps learners distinguish AND from OR.                                   |
| 6   | Monster Adventure                                     | Use a condition to select an action in a changing situation. **Concept:** conditionals.                                  | Build `if / else` blocks using familiar Boolean and operator blocks.                                | The character responds to monster, obstacle, and safe-path states. Tests cover both branches, so the learner must program a complete decision.                                 |
| 7   | **World 3: Store Information** — Coin Collector       | Store and update a changing value. **Concept:** variables/data.                                                          | Use `set coins to` and `change coins by` blocks.                                                    | Coins visibly update during the run. Hidden test cases check that the final score is calculated by the learner's program.                                                      |
| 8   | Backpack Inventory                                    | Represent values as appropriate kinds of data. **Concept:** data types.                                                  | Assign provided text, number, and Boolean values to inventory variables.                            | The inventory accepts or rejects incompatible values and explains why. Tasks reuse variables while introducing meaningful data representations.                                |
| 9   | Robot Cleaner                                         | Use repetition to shorten a repeated sequence. **Concept:** loops.                                                       | Replace repeated movement blocks with `repeat` and a body of actions.                               | The robot cleans a repeated path; block count and mission tests show whether the loop is correct. The learner has already practised commands and conditions.                   |
| 10  | **World 4: Solve Bigger Problems** — Garden Builder   | Combine repetition structures to create a two-dimensional pattern. **Concept:** nested loops.                            | Use an outer `repeat row` and inner `repeat tile` structure.                                        | The garden grows tile by tile. Tests compare the produced pattern to the target and identify the incomplete row or column.                                                     |
| 11  | Connect the Path                                      | Plan a process using symbols, decisions, and ordered flow. **Concept:** flowcharts/algorithm representation.             | Connect start, process, decision, and end nodes; translate the completed flow into supplied blocks. | An animated trace follows the flowchart. The assessment checks valid connections and agreement between chart and program.                                                      |
| 12  | Mission Planner                                       | Express an algorithm precisely before implementation. **Concept:** pseudocode.                                           | Complete structured pseudocode statements, then map them to blocks.                                 | The platform highlights the pseudocode step currently executed. Validation checks the resulting block behaviour, not only text matching.                                       |
| 13  | **World 5: Become a Game Developer** — Build a Castle | Break a large task into smaller, manageable subproblems. **Concept:** decomposition.                                     | Create separate scripted parts for wall, gate, and tower missions.                                  | Each completed part visibly builds the castle. Assessment requires all subgoals to pass and prompts the learner to revise an isolated failing part.                            |
| 14  | Wizard Spells                                         | Define and reuse named behaviour with input values. **Concept:** functions and parameters.                               | Define a `cast spell` function and call it with parameters such as direction or distance.           | Reused calls animate consistent spell effects. Tests require the function to work with more than one input, distinguishing reuse from copied blocks.                           |
| 15  | Build Your Own Mini Game                              | Plan, implement, test, and communicate a small interactive program. **Concept:** creative application of prior concepts. | Choose a template, create blocks, run, test, debug, and name the game.                              | A rubric checks an executable program, at least one interaction, and the purposeful use of selected concepts. The learner can share a local preview rather than personal data. |

## 5. Existing-prototype mapping

The current prototypes are useful evidence of early game ideas, but most still
use selection, sorting, or question-answer interaction rather than learner-made
programs. Their intended mapping is:

| Existing prototype      | Intended level | Required change                                                                             |
| ----------------------- | -------------- | ------------------------------------------------------------------------------------------- |
| GL1: Tom and Jerry maze | 1              | Replace direct controls with ordered movement blocks and a run simulation.                  |
| GL2: pizza order        | 2              | Replace move-up/move-down sorting with draggable instruction blocks and execution feedback. |
| GL4: true or false      | 3              | Replace answer buttons with a constructed Boolean condition.                                |
| GL6: secret gates       | 4              | Replace answer buttons with an AND expression in a conditional.                             |
| No current prototype    | 5              | Design an OR-based escape-route mission.                                                    |
| GL5: if adventure       | 6              | Replace answer buttons with an if/else program and scenario tests.                          |
| GL7: coin count         | 7              | Replace manual answer entry with variable blocks and a running score.                       |
| GL8: data types         | 8              | Replace answer selection with typed values in an inventory program.                         |
| GL3: treasure loop      | 9              | Replace controlled repeat settings with learner-created loop blocks.                        |

## 6. Thesis scope and implementation sequence

1. Verify the source editions and exact standards mapping with the supervisor.
2. Review and approve this level matrix, including the target age range and
   success evidence for every level.
3. Define the coding-engine architecture and accessibility requirements before
   selecting or installing Blockly.
4. Implement one vertical slice: Level 2 from mission through block program,
   simulation, feedback, and assessment.
5. Reuse that engine for Level 1, then Levels 3–6. Do not build 15 unrelated
   games.
6. Select a feasible implemented subset for evaluation; document the remaining
   levels as a validated design rather than claiming they were implemented.
7. Conduct a consent-appropriate pilot with target learners and evaluate task
   completion, attempts, debugging behaviour, help requests, and perceived
   clarity. Protect child data and follow the project's privacy requirements.

## 7. Decisions requiring supervisor approval

- Is the thesis contribution a design-and-implementation prototype, a user
  study, or both?
- Which age-band division is used during evaluation (for example, 10–12 and
  13–15) so that differences are not hidden by the wide target range?
- How many levels are implemented and evaluated within the available time?
- Which standards edition and local curriculum requirements are authoritative?
- Is Blockly appropriate for the technical and accessibility constraints, or is
  a smaller custom block interface preferable?
