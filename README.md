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
- `--exclude <comma-delimited-persons>` — Specify persons to exclude from the sort. To specify multiple persons either delimit persons by comma or use the flag more than once.

Examples:

```bash
npm start -- --dry-run --exclude taylor,jake,tyler
npm start -- --exclude taylor --exclude jake
```

## Future Improvements

- [ ] Use a field other than `firstName` as the unique identifier of persons. Create a true `id` field or use `email`.
- [ ] Improve the matching algorithm by adding a scoring factor such that the matcher attempts to optimize matches for each person and the highest scored set of matches wins. As of now it optimizes the person who has met with the most people, which may not ultimately the best (i.e. least recent) set of overall matches.
- [ ] Use a true CLI scripting library instead of just args. Would make it easier to print command help at runtime or use as a standalone binary.
- [ ] Add a web UI
- [ ] Allow for 1:1:1 or any configurable of match size per run
