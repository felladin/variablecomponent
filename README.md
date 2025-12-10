# ServiceNow Variable Display Component

A configurable workspace component for ServiceNow that displays variables associated with records through direct or many-to-many (M2M) relationships.

## Overview

This component allows you to display variables on any record page in ServiceNow's Configurable Workspace. It supports both direct associations (where variables are directly linked to the record) and many-to-many relationships (where variables are linked through an intermediary table).

## Features

- **Flexible Relationship Support**: Works with both direct and M2M relationships
- **Configurable Display**: Choose which fields to display and how to format them
- **Responsive Design**: Adapts to different screen sizes
- **Error Handling**: Comprehensive error states and user feedback
- **Performance Optimized**: Configurable limits and efficient queries
- **Security Aware**: Respects ServiceNow ACLs and permissions

## Component Structure

```
src/x-snc-variable-display-component/
├── component.json          # Component metadata and configuration schema
├── client_script.js        # Client-side controller logic
├── data_provider.js        # Server-side data retrieval
├── template.html           # Component HTML template
└── styles.scss            # Component styling
```

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/felladin/variablecomponent.git
   ```

2. **Import into ServiceNow**
   - Navigate to UI Builder in your ServiceNow instance
   - Create a new component or import existing
   - Copy the files from `src/x-snc-variable-display-component/`

3. **Configure the Component**
   - Add the component to a workspace page
   - Set the variable table name
   - Choose relationship type (direct or M2M)
   - Configure display options

## Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| Variable Table | String | `item_option_new` | Table containing variables |
| Relationship Type | Choice | `direct` | Direct or M2M relationship |
| M2M Table | String | - | M2M relationship table name |
| M2M Source Field | String | `parent` | Field referencing current record |
| M2M Variable Field | String | `variable` | Field referencing variable |
| Display Fields | String | `question_text,value,type` | Comma-separated field list |
| Show Labels | Boolean | `true` | Show field labels |
| Maximum Records | Number | `50` | Max variables to display |

## Usage Examples

### Direct Relationship
```javascript
// Configuration for displaying variables directly linked to a record
{
  "variableTable": "sc_item_option",
  "relationshipType": "direct",
  "displayFields": "question_text,value,type",
  "showLabels": true
}
```

### Many-to-Many Relationship
```javascript
// Configuration for M2M relationship through intermediary table
{
  "variableTable": "item_option_new",
  "relationshipType": "m2m",
  "m2mTable": "m2m_variable_association",
  "m2mSourceField": "parent",
  "m2mVariableField": "variable",
  "displayFields": "question_text,value,type"
}
```

## Documentation

- [Complete Usage Guide](COMPONENT_USAGE.md) - Detailed configuration and usage instructions
- [Component API](src/x-snc-variable-display-component/README.md) - Technical API documentation

## Requirements

- ServiceNow instance with UI Builder enabled
- Workspace Designer role or equivalent permissions
- Knowledge of ServiceNow tables and relationships

## Support

For detailed usage instructions, troubleshooting, and examples, see [COMPONENT_USAGE.md](COMPONENT_USAGE.md).

## License

This project is provided as-is for use with ServiceNow instances.

## Contributing

Contributions are welcome! Please ensure any changes:
- Follow ServiceNow best practices
- Include appropriate error handling
- Are tested in a sub-production instance
- Update documentation as needed