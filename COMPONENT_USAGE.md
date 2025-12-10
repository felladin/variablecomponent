# Variable Display Component - Usage Guide

## Overview
The Variable Display Component is a ServiceNow Configurable Workspace component that displays variables associated with records through either direct relationships or many-to-many (M2M) relationships.

## Features
- Display variables from any ServiceNow table
- Support for direct and M2M relationships
- Configurable field display
- Responsive design
- Loading and error states
- Refresh functionality

## Installation

### Prerequisites
- ServiceNow instance with UI Builder enabled
- Appropriate permissions to create workspace components

### Installation Steps
1. Navigate to UI Builder in your ServiceNow instance
2. Create a new component or import the component files
3. Copy the component files to the appropriate locations:
   - `component.json` - Component metadata
   - `client_script.js` - Client-side controller
   - `data_provider.js` - Server-side data provider
   - `template.html` - Component template
   - `styles.scss` - Component styles

## Configuration

### Component Properties

#### Variable Table
- **Property**: `variableTable`
- **Type**: String
- **Default**: `item_option_new`
- **Description**: The table containing the variables to display
- **Required**: Yes

#### Relationship Type
- **Property**: `relationshipType`
- **Type**: Choice (direct/m2m)
- **Default**: `direct`
- **Description**: How variables are related to the record
- **Required**: Yes

#### M2M Table
- **Property**: `m2mTable`
- **Type**: String
- **Default**: Empty
- **Description**: The many-to-many relationship table name
- **Required**: Only if relationship type is M2M

#### M2M Source Field
- **Property**: `m2mSourceField`
- **Type**: String
- **Default**: `parent`
- **Description**: Field in M2M table that references the current record
- **Required**: No

#### M2M Variable Field
- **Property**: `m2mVariableField`
- **Type**: String
- **Default**: `variable`
- **Description**: Field in M2M table that references the variable
- **Required**: No

#### Direct Association Field
- **Property**: `directAssociationField`
- **Type**: String
- **Default**: `parent`
- **Description**: Field name in variable table that references the current record (for direct relationships). If not specified, the component will try common field names.
- **Required**: No

#### Display Fields
- **Property**: `displayFields`
- **Type**: String (comma-separated)
- **Default**: `question_text,value,type`
- **Description**: Fields to display from the variable table
- **Required**: No

#### Show Labels
- **Property**: `showLabels`
- **Type**: Boolean
- **Default**: `true`
- **Description**: Display field labels above values
- **Required**: No

#### Maximum Records
- **Property**: `maxRecords`
- **Type**: Number
- **Default**: `50`
- **Description**: Maximum number of variables to display
- **Required**: No

## Usage Examples

### Example 1: Direct Relationship
Display variables directly associated with a request item:

```json
{
  "variableTable": "sc_item_option",
  "relationshipType": "direct",
  "directAssociationField": "request_item",
  "displayFields": "question_text,value",
  "showLabels": true,
  "maxRecords": 50
}
```

### Example 2: Many-to-Many Relationship
Display variables through an M2M table:

```json
{
  "variableTable": "item_option_new",
  "relationshipType": "m2m",
  "m2mTable": "m2m_variable_association",
  "m2mSourceField": "parent",
  "m2mVariableField": "variable",
  "displayFields": "question_text,value,type,order",
  "showLabels": true,
  "maxRecords": 100
}
```

### Example 3: Custom Variable Table
Display custom variables with specific fields:

```json
{
  "variableTable": "u_custom_variables",
  "relationshipType": "direct",
  "displayFields": "u_label,u_value,u_category",
  "showLabels": true,
  "maxRecords": 25
}
```

## Adding to a Workspace Page

1. Open UI Builder and navigate to the desired workspace page
2. In the page editor, add a new component
3. Search for "Variable Display Component"
4. Drag the component to the desired location
5. Configure the component properties using the property panel
6. Save and publish the page

## Field Types Support

The component supports various ServiceNow field types:
- **String**: Text values
- **Boolean**: Yes/No values (displays with checkmark)
- **Reference**: References to other records (displays as link)
- **Choice**: Choice field values (displays with badge styling)
- **Integer/Decimal**: Numeric values
- **Date/DateTime**: Date and time values

## Error Handling

The component includes comprehensive error handling:
- Invalid configuration displays error message
- Missing M2M table displays warning
- No variables found displays info message
- Loading state during data retrieval
- Server errors are caught and displayed

## Performance Considerations

- Use the `maxRecords` property to limit data retrieval
- Consider indexing fields used in queries
- M2M relationships require additional query; use sparingly
- Display only necessary fields to reduce data transfer

## Troubleshooting

### No Variables Displayed
1. Check that the record has associated variables
2. Verify the `variableTable` is correct
3. Ensure proper ACLs for reading the variable table
4. Check browser console for errors

### M2M Configuration Not Working
1. Verify the M2M table name is correct
2. Check that `m2mSourceField` and `m2mVariableField` exist in the M2M table
3. Ensure the M2M table has records linking the current record to variables

### Performance Issues
1. Reduce `maxRecords` value
2. Limit the number of `displayFields`
3. Add appropriate indexes to query fields
4. Consider caching if displaying same data repeatedly

## Security

The component respects ServiceNow's security model:
- ACLs are enforced on all queries
- Users can only see variables they have permission to access
- Cross-scope access follows standard ServiceNow rules

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Support

For issues or questions:
1. Check the ServiceNow documentation for UI Builder components
2. Review the component logs in System Logs
3. Verify configuration settings
4. Contact your ServiceNow administrator
