# Instructions

This tool is for expanding variation syntax for use in various natural-language processing applications, such as chatbots and AI assistants. It takes raw variation syntax as input and gives either samples or a full list of variations as output:

-   Samples — a short list of generated examples, covering each individual variation but not every combination of variations. Suitable for translation to downstream languages.
-   Full list — the full list of generated variation, covering every combination. Suitable for direct input into systems not designed to interpret variation syntax.

---

## Syntax

The variation syntax uses square brackets (`[]`) and slashes (`/`) to indicate alternative words or phrases. For example:

### Alternative wording

```
You [selected/chose/have chosen] option 1.
```

**Sample output**:

```
You selected option 1.
You chose option 1.
You have chosen option 1.
```

### Optional words

```
Look to the left[-hand side/].
```

**Sample output**:

```
Look to the left-hand side.
Look to the left.
```

### Full alternative sentences

To indicate more complete alternative sentences, use multiple lines:

```
This is the first alternative.
This is option [number/] two.
```

**Sample output**:

```
This is the first alternative.
This is option number two.
This is option two.
```

### Combined

Putting them all together:

```
[Turn on/Switch on/Enable/Activate] [the/] driver['s seat/] fan [mode/].
[Turn/Switch] [the/] driver['s seat/] fan on.
```

**Sample output**:

```
Turn on the driver's seat fan mode.
Switch on driver fan.
Enable the driver's seat fan mode.
Activate driver fan.
Turn the driver's seat fan on.
Switch driver fan on.
```

### Limitations

Nesting brackets within other brackets is **not** currently supported. For example, only the second version of these two works correctly:

```
❌ [[Turn/Switch] on/Enable/Activate] the feature.
✅ [Turn on/Switch on/Enable/Activate] the feature.
```

Square brackets can also not currently be escaped — they will always be interpreted as variation syntax.

---

## Preview page

The [preview](/) page is for translators or writers to test out whether the syntax is being expanded as intended. Simply copy, paste, and edit the raw version and view the samples and full list of variations change in real time.

---

## Convert page

The [convert](/convert) page is for reviewers, QA professionals, or project managers to expand the syntax for an entire Excel file, or one or more range of cells in a file. It can also be used by translators or writers to check the output before submission.

"Ranges to include" can be either `*`, meaning all cells in all worksheets, or a comma/newline-separated list of cell ranges using Excel's native range syntax. For example:

-   `A1:B5` — cells A1 to B5, in each worksheet in the file
-   `A:D` — all cells in columns A to D, in each worksheet in the file
-   `sheet&#95;one!F8:L14` — cells F8 to L14 in worksheet "sheet_one"
-   `'sheet two'!C:C` — column C in worksheet "sheet two"
-   `A:A,Sheet1!B:C,'batch two'!A2:C75` — column A in every worksheet in the file, columns B and C in worksheet "Sheet1", and cells A2 to C75 in worksheet "batch two"

Note that the characters `'!:,` in sheet names are not currently supported.
