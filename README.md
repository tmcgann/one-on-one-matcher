# One-on-one Matcher

A simple tool that takes a list of people and matches them up for a 1:1.

The algorithm attempts to match each person with the person they have met with least recently.

## Set up

Create a `src/data/persons.json` file with a JSON schema similar to the following:

```json
[
  {
    "firstName": "Taylor",
    "lastName": "McGann",
    "email": "taylormcgann@example.com",
    "queue": []
  }
]
```

As of the current version, `firstName` is treated as the unique identifier for a person; however, `email` has been added to the schema as a potential future unique identifier.

## Run

To run the matcher:

```bash
npm start
```

Options:

- `--dry-run | --skip-save` — Skips the save portion of the script and just produces output
- `--exclusions <comma-delimited-persons> | --exclusion <person>` — Specify persons to exclude from the sort. The `--exclusion` flag can be specified multiple times to achieve the same functionality as `--exclusions`.

Examples:

```bash
npm start -- --dry-run --exclusions taylor,jake,tyler
npm start -- --exclusion taylor --exclusion jake
```

## Future Improvements

- [ ] Use a field other than `firstName` as the unique identifier of persons. Create a true `id` field or use `email`.
- [ ] Improve the matching algorithm by adding a scoring factor such that the matcher attempts to optimize matches for each person and the highest scored set of matches wins. As of now it optimizes the person who has met with the most people, which may not ultimately the best (i.e. least recent) set of overall matches.
- [ ] Use a true CLI scripting library instead of just args. Would make it easier to print command help at runtime or use as a standalone binary.
- [ ] Add a web UI
