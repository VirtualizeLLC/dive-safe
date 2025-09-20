# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Multiple HTTPS Tokens

```
git config --global credential.useHttpPath true
```


## Get started

 # Dive-Safe

 Table of Contents

 - [Scope of the app](#scope-of-the-app)
 - [Current features](#current-features)
 - [Upcoming features](#upcoming-features)
 - [Platform support](#platform-support)
 - [Types of support & community contributions](#types-of-support--community-contributions)
   - [In-depth rebreather setup guides](#in-depth-rebreather-setup-guides)
   - [Endorsements and community comments](#endorsements-and-community-comments)
 - [Safety & legal disclaimer](#safety--legal-disclaimer)
 - [How to help / Contributing](#how-to-help--contributing)
 - [Contact / License](#contact--license)
 - [Development](./docs/development.md)
   - [Getting started](./docs/development.md#getting-started)
   - [Development workflow](./docs/development.md#development-workflow)
   - [Storybook and UI testing](./docs/development.md#storybook-and-ui-testing)



## Scope of the app

Dive-Safe is intended to be a companion application for technical diving operations. Its focus is to provide:

- Guided procedures for complex rebreather setups and maintenance.
- Checklists and step-by-step assembly/disassembly guides.
- Safety reminders and community-shared configuration notes.
- Offline-friendly reference materials for dive teams.

This project is strictly a development-stage tool and is not certified for operational use. See the Safety & legal disclaimer below.


## Current features

- Rebreather assembly guides (example: Choptima CCR assembly walkthrough).
- UI scaffolding with Expo and Storybook for component-driven development.
- A collapsible in-app header to switch between the full app and Storybook/demo view.
- Basic navigation and a modular component structure.


## Upcoming features

Planned additions include:

- Per-rebreather endorsed configuration pages with step-by-step checklists.
- Community comment and endorsement system (moderated contributions).
- Offline caching and encrypted storage of critical configs (MMKV integration).
- Export/import of validated assembly checklists.
- Enhanced device integration (bluetooth logging, transmit to dive computers).


## Platform support

- iOS: supported (development builds and simulator)
- Android: supported (development builds and emulator)
- Desktop / Web: experimental (web support via Expo web; desktop native builds TBD)


## Types of support & community contributions

We plan to support several structured contribution types so divers and technical editors can add value while keeping safety in mind.

### In-depth rebreather setup guides

- Each supported rebreather model will have a dedicated guide containing:
  - Assembly and disassembly steps with images.
  - Recommended settings and configurables.
  - Common maintenance checkpoints.
  - Known caveats and community-provided tips.

- Guides will be versioned and have a strict review/endorsement workflow before being labeled as "endorsed".

### Endorsements and community comments

- Community members will be able to comment on guides and submit suggestions.
- Endorsements will be available for qualified contributors; endorsement criteria and the reviewer workflow will be defined before endorsements are published.


## Safety & legal disclaimer

IMPORTANT: This software is experimental and under active development. It is NOT certified for operational diving use.

- Do NOT rely on this application as your primary source of safety-critical information.
- Use at your own risk. The maintainers assume no liability for injuries, damages, or losses resulting from the use of this software.
- Always follow manufacturer manuals, qualified training, and organizational SOPs.

By using or testing this software you acknowledge that it is provided "as-is" and that you accept full responsibility for any use.


## How to help / Contributing

- Read the code and open issues for missing features or bugs.
- Follow pull request guidelines and include tests where appropriate.
- For safety-critical content (rebreather instructions), submit changes as proposals and include references and photographic evidence where possible.


## Contact / License

This project is published under a source-available license. See `LICENSE.md` for full details.

For questions or commercial licensing, contact Virtualize LLC.
