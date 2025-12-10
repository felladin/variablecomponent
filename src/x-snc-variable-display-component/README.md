# Variable Display Component - Technical Documentation

## Component Architecture

### Overview
This component follows ServiceNow's UI Builder component architecture with client-side rendering and server-side data providers.

### Component Files

#### component.json
Component metadata file that defines:
- Component name and description
- Data providers
- Configuration properties and their types
- Default values

#### client_script.js
Client-side controller that:
- Initializes component state
- Handles user interactions
- Manages data provider calls
- Processes and formats data for display
- Implements refresh functionality

#### data_provider.js
Server-side script that:
- Retrieves variables from database
- Handles direct and M2M relationships
- Implements security checks
- Formats data for client consumption

#### template.html
Angular-based template that:
- Defines component layout
- Handles loading states
- Displays error messages
- Renders variable data
- Provides responsive UI

#### styles.scss
SCSS stylesheet that:
- Defines component styling
- Implements responsive design
- Provides type-specific styling
- Includes loading animations

## Data Flow

```
User Action → Client Controller → Data Provider → Database
                     ↓                  ↓
               Process Data ← Return Data
                     ↓
              Update Template
```

## API Reference

### Client Controller API

#### initialize()
Initializes the component, loads configuration, and fetches initial data.

```javascript
c.initialize()
```

#### refresh()
Manually refreshes the component data.

```javascript
c.refresh()
```

#### onPropertyChange(property, oldValue, newValue)
Handles configuration property changes.

```javascript
c.onPropertyChange('variableTable', 'old_table', 'new_table')
```

### Data Provider API

#### variableDataProvider(input)
Main data provider function that retrieves variables.

**Parameters:**
- `input.recordId` (String): sys_id of the current record
- `input.table` (String): Current table name
- `input.variableTable` (String): Variable table name
- `input.relationshipType` (String): 'direct' or 'm2m'
- `input.m2mTable` (String): M2M table name (if applicable)
- `input.m2mSourceField` (String): M2M source field
- `input.m2mVariableField` (String): M2M variable field
- `input.displayFields` (String): Comma-separated field list
- `input.maxRecords` (Number): Maximum records to retrieve

**Returns:**
```javascript
{
  variables: Array,  // Array of variable objects
  error: String,     // Error message if any
  hasData: Boolean   // Whether variables were found
}
```

### Internal Functions

#### getDirectVariables(recordId, variableTable, fields, maxRecords)
Retrieves variables directly associated with a record.

#### getM2MVariables(recordId, variableTable, m2mTable, sourceField, variableField, fields, maxRecords)
Retrieves variables through M2M relationship.

#### buildVariableObject(gr, fields)
Builds a variable object from a GlideRecord.

#### processVariables(variables)
Processes raw variable data for display in the template.

## Data Structures

### Variable Object (Server)
```javascript
{
  sys_id: "abc123",
  field_name: {
    value: "raw_value",
    displayValue: "Display Value",
    label: "Field Label",
    type: "string"
  }
}
```

### Processed Variable Object (Client)
```javascript
{
  sys_id: "abc123",
  fields: [
    {
      name: "field_name",
      label: "Field Label",
      value: "Display Value",
      type: "string"
    }
  ]
}
```

## Query Patterns

### Direct Relationship Query
```javascript
// Searches for variables using common association fields
var gr = new GlideRecord(variableTable);
gr.addQuery('parent', recordId);
// OR gr.addQuery('document_key', recordId);
// OR gr.addQuery('sys_target', recordId);
gr.query();
```

### M2M Relationship Query
```javascript
// Step 1: Get variable IDs from M2M table
var m2mGr = new GlideRecord(m2mTable);
m2mGr.addQuery(sourceField, recordId);
m2mGr.query();

// Step 2: Get variables by IDs
var varGr = new GlideRecord(variableTable);
varGr.addQuery('sys_id', 'IN', variableIds.join(','));
varGr.query();
```

## Configuration Schema

### Property Types
- `string`: Text input
- `number`: Numeric input
- `boolean`: Checkbox
- `choice`: Dropdown selection

### Property Validation
Properties marked as `mandatory: true` must have values for the component to function.

## Error Handling

### Client-Side Errors
- Network failures
- Invalid responses
- Component initialization errors

### Server-Side Errors
- Invalid table names
- Missing M2M configuration
- Query failures
- Permission errors

## Security Considerations

### Access Control
- All queries respect ServiceNow ACLs
- Users can only see records they have permission to access
- Cross-scope access follows standard ServiceNow security model

### Data Validation
- Input parameters are validated
- Table and field names are checked for validity
- Query results are sanitized

## Performance Optimization

### Query Optimization
- Use `setLimit()` to restrict result set
- Query only necessary fields
- Use indexed fields in queries when possible

### Client Optimization
- Lazy loading of data
- Efficient DOM updates
- Minimal re-renders

### Best Practices
1. Set appropriate `maxRecords` limits
2. Display only necessary fields
3. Use direct relationships when possible (M2M adds overhead)
4. Consider caching for frequently accessed data

## Troubleshooting

### Debug Mode
Enable logging in data_provider.js:
```javascript
gs.info('Variable query: ' + gr.getEncodedQuery());
```

### Common Issues

#### No Data Displayed
- Check ACLs on variable table
- Verify record has associated variables
- Check relationship configuration

#### Performance Issues
- Reduce maxRecords
- Limit displayFields
- Add database indexes

#### Configuration Errors
- Validate table names
- Check field names in M2M configuration
- Ensure mandatory properties are set

## Testing

### Unit Testing
Test data provider functions independently:
```javascript
var input = {
  recordId: 'test_id',
  variableTable: 'item_option_new',
  relationshipType: 'direct',
  displayFields: 'question_text,value',
  maxRecords: 10
};
var result = data.variableDataProvider(input);
gs.info('Result: ' + JSON.stringify(result));
```

### Integration Testing
1. Create test records with variables
2. Configure component on test page
3. Verify data display
4. Test error conditions
5. Validate permissions

## Extending the Component

### Adding Custom Fields
1. Update component.json with new properties
2. Add handling in client_script.js
3. Update template.html for display
4. Add styles in styles.scss

### Custom Data Sources
1. Modify data_provider.js
2. Add new query functions
3. Update buildVariableObject for custom fields

### Custom Styling
1. Edit styles.scss
2. Add CSS classes in template.html
3. Use ServiceNow's theme variables

## Version History

### 1.0.0 (Initial Release)
- Direct relationship support
- M2M relationship support
- Configurable field display
- Responsive design
- Error handling
- Loading states

## Future Enhancements

Potential improvements:
- Inline editing of variable values
- Sorting and filtering
- Export functionality
- Variable grouping
- Custom formatters
- Search capability
- Bulk operations
