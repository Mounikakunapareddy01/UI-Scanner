import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    // Reload the section, or just clear error:
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Friendly panel with suggestions & fix
      return (
        <div style={{
          padding: 40, color: '#EA4C89', background: '#fbeff7',
          borderRadius: 16, textAlign: 'center', margin: '2em auto', maxWidth: 500
        }}>
          <h3>Oops, that didn't work!</h3>
          <p>
            <b>Error:</b> {this.state.error?.message || 'Unknown issue.'}
          </p>
          <div style={{ margin: '22px 0', color: '#333', fontSize: 16 }}>
            <ul style={{ textAlign: 'left'}}>
              <li>• The color you entered may be invalid (e.g. <code>rgb(255,255,255)</code> should be <code>#FFFFFF</code> or <code>white</code>).</li>
              <li>• Try a proper hex code, common color name, or valid RGB value.</li>
              <li>• <b>Auto-Fix:</b> Use <button style={{
                background: '#0A72EF', color: '#fff', borderRadius: 6, padding: '4px 18px', border: 'none'
              }} onClick={this.handleReset}>a safe default color</button>.</li>
            </ul>
          </div>
          <div style={{ color: '#888', fontSize: 14 }}>
            You can also click "Scan Page" or "Reload Section" to retry.
          </div>
        </div>
      );
    }
    // Normal rendering
    return this.props.children;
  }
}
