---
name: installations-club-panel-table-view
description: Modified the ClubFacilitiesPanel to display installations club data as a table with installations as rows, niveaux as columns, and bonuses in cells, with selectable cellules and total cost display. Also updated PlayStylesPanel to maintain compatibility with the new selections format.
---

The ClubFacilitiesPanel.jsx was modified to display the installations club data in a table format as requested by the user. Instead of a simple list of installations with checkboxes, it now shows:

- **Rows**: Each unique installation available (from the installationsClub data in fc27.json)
- **Columns**: Niveau 1, Niveau 2, Niveau 3
- **Cells**: The bonus attributes for that installation at that niveau, with each bonus on a separate line
- **Selectable cellules**: Clicking on a cellule toggles the selection of that installation at that specific niveau
- **Visual feedback**: Selected cells are highlighted, show a cost indicator (+coût), and display tooltips with the cost
- **Total cost display**: The top right of the panel shows the sum of costs for all selected installation-niveau combinations
- **Scrollable container**: The table has a maximum height with vertical scrolling when there are many installations

The data structure for the selections prop was changed from an array of installation IDs to an object mapping installation IDs to selected niveau (0 = not selected, 1, 2, or 3 = selected at that niveau). The onChange callback is called with this updated selections object whenever a cellule is clicked.

To maintain compatibility with the parent component (PlayStylesPanel.jsx), the following updates were made:
- PlayStylesPanel now converts the installations prop from the old format (array of selected installation IDs) to the new format (object mapping IDs to niveau, defaulting to niveau 1) when passing to ClubFacilitiesPanel
- PlayStylesPanel also converts the onChange callback from the new format back to the old format (array of selected installation IDs) before calling the parent's onInstallations function

CSS styles were added to support the table layout, cell selection visualization, bonus line-by-line display, and total cost styling.

This implementation allows users to see exactly what bonuses they get for what cost at each niveau for each installation, and make informed decisions about which installation-niveau combinations to select for their build.
---
**Why:** The user requested to see the installations club data presented with installations as rows, niveaux as columns, and bonuses at the intersections, with selectable cellules and total cost display.
**How to apply:** The modified ClubFacilitiesPanel.jsx maintains backward compatibility through automatic format conversion in PlayStylesPanel.jsx. Other components that directly use ClubFacilitiesPanel may need similar updates to handle the new selections object format.