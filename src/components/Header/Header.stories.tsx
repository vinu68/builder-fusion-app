import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Header from "./Header";
import type { HeaderBehaviorConfig } from "./useHeaderBehaviors";
import { AnalyticsProvider } from "../../contexts/AnalyticsContext";

// Wrapper component for analytics context
const HeaderWithAnalytics = (props: any) => (
  <AnalyticsProvider
    config={{
      enabled: true,
      debug: true,
    }}
  >
    <Header {...props} />
  </AnalyticsProvider>
);

const meta = {
  title: "Components/Header",
  component: HeaderWithAnalytics,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A comprehensive e-commerce header component with logo, search, navigation, and user actions. Features responsive design, accessibility, theme support, and configurable behaviors through hooks.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    favoritesCount: {
      control: "number",
      description: "Number of items in favorites",
    },
    cartItemsCount: {
      control: "number",
      description: "Number of items in cart",
    },
    userLocation: {
      control: "text",
      description: "User location displayed in stores section",
    },
    isLoggedIn: {
      control: "boolean",
      description: "Whether user is logged in",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    // Behavior configuration controls
    "behaviorConfig.enableRouting": {
      control: "boolean",
      description: "Enable automatic routing on navigation",
      table: { category: "Behavior Configuration" },
    },
    "behaviorConfig.enableAnalytics": {
      control: "boolean",
      description: "Enable analytics tracking",
      table: { category: "Behavior Configuration" },
    },
  },
  args: {
    // Default behavior configuration with Storybook actions
    behaviorConfig: {
      enableRouting: false, // Disable routing in Storybook
      enableAnalytics: true,
      onNavigateToHome: action("navigate-to-home"),
      onNavigateToSearch: action("navigate-to-search"),
      onNavigateToSection: action("navigate-to-section"),
      onNavigateToStores: action("navigate-to-stores"),
      onNavigateToCommunity: action("navigate-to-community"),
      onNavigateToSignIn: action("navigate-to-sign-in"),
      onNavigateToFavorites: action("navigate-to-favorites"),
      onNavigateToCart: action("navigate-to-cart"),
      onSearchSubmit: action("search-submit"),
      onSearchQueryChange: action("search-query-change"),
      onUserAction: action("user-action"),
      onMobileMenuToggle: action("mobile-menu-toggle"),
    } as HeaderBehaviorConfig,
  },
} satisfies Meta<typeof HeaderWithAnalytics>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default header
export const Default: Story = {
  args: {
    favoritesCount: 0,
    cartItemsCount: 0,
    userLocation: "Laurent, Jakarta",
    isLoggedIn: false,
  },
};

// Logged in user
export const LoggedIn: Story = {
  args: {
    favoritesCount: 3,
    cartItemsCount: 2,
    userLocation: "Laurent, Jakarta",
    isLoggedIn: true,
  },
};

// With items in cart and favorites
export const WithItems: Story = {
  args: {
    favoritesCount: 12,
    cartItemsCount: 5,
    userLocation: "New York, NY",
    isLoggedIn: true,
  },
};

// Different location
export const DifferentLocation: Story = {
  args: {
    favoritesCount: 0,
    cartItemsCount: 0,
    userLocation: "London, UK",
    isLoggedIn: false,
  },
};

// High numbers in counters
export const HighNumbers: Story = {
  args: {
    favoritesCount: 99,
    cartItemsCount: 15,
    userLocation: "Tokyo, Japan",
    isLoggedIn: true,
  },
};

// Mobile view showcase
export const MobileView: Story = {
  args: {
    favoritesCount: 5,
    cartItemsCount: 3,
    userLocation: "Laurent, Jakarta",
    isLoggedIn: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Header optimized for mobile devices with hamburger menu and simplified layout.",
      },
    },
  },
};

// Tablet view showcase
export const TabletView: Story = {
  args: {
    favoritesCount: 2,
    cartItemsCount: 1,
    userLocation: "Laurent, Jakarta",
    isLoggedIn: false,
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story:
          "Header layout optimized for tablet devices with condensed text and spacing.",
      },
    },
  },
};

// Interactive demo with custom behaviors
export const InteractiveDemo: Story = {
  args: {
    favoritesCount: 3,
    cartItemsCount: 2,
    userLocation: "Laurent, Jakarta",
    isLoggedIn: true,
    behaviorConfig: {
      enableRouting: false,
      enableAnalytics: true,
      onSearchSubmit: async (query: string) => {
        action("search-submit")(query);
        // Simulate search with results
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockResults = Math.floor(Math.random() * 50) + 1;
        action("search-results")(mockResults);
        return mockResults;
      },
      onNavigateToSection: (section: string, href: string) => {
        action("navigate-to-section")(section, href);
        alert(`Navigating to: ${section} (${href})`);
      },
      onNavigateToHome: () => {
        action("navigate-to-home")();
        alert("Navigating to home page");
      },
      onNavigateToStores: () => {
        action("navigate-to-stores")();
        alert("Opening stores and services");
      },
      onNavigateToCommunity: () => {
        action("navigate-to-community")();
        alert("Opening community page");
      },
      onNavigateToSignIn: () => {
        action("navigate-to-sign-in")();
        alert("Opening sign in page");
      },
      onNavigateToFavorites: () => {
        action("navigate-to-favorites")();
        alert("Opening favorites");
      },
      onNavigateToCart: () => {
        action("navigate-to-cart")();
        alert("Opening shopping cart");
      },
      onUserAction: (actionType: string, data?: any) => {
        action("user-action")(actionType, data);
        console.log(`User action: ${actionType}`, data);
      },
      onMobileMenuToggle: (isOpen: boolean) => {
        action("mobile-menu-toggle")(isOpen);
        console.log(`Mobile menu ${isOpen ? "opened" : "closed"}`);
      },
    },
  },
  render: (args) => (
    <div style={{ minHeight: "200px" }}>
      <HeaderWithAnalytics {...args} />
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <h2>Interactive Header Demo</h2>
        <p>Try interacting with the header elements:</p>
        <ul
          style={{ textAlign: "left", maxWidth: "400px", margin: "20px auto" }}
        >
          <li>Search for products in the search bar</li>
          <li>Click on navigation items</li>
          <li>Try the favorites and cart buttons</li>
          <li>Test the stores & services section</li>
          <li>Check responsive behavior by resizing</li>
          <li>Open the Actions panel to see tracked events</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Interactive example showing all header functionality with visible event tracking. Click elements to see interactions in the Actions panel.",
      },
    },
  },
};

// Behavior testing story
export const BehaviorTesting: Story = {
  args: {
    favoritesCount: 5,
    cartItemsCount: 3,
    userLocation: "Test Location",
    isLoggedIn: true,
    behaviorConfig: {
      enableRouting: false,
      enableAnalytics: true,
      onSearchSubmit: action("search-submit"),
      onNavigateToHome: action("navigate-home"),
      onNavigateToSection: action("navigate-section"),
      onUserAction: action("user-action"),
    },
  },
  render: (args) => (
    <div>
      <HeaderWithAnalytics {...args} />
      <div
        style={{
          padding: "40px 20px",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <h2>Behavior Testing</h2>
        <div
          style={{ textAlign: "left", maxWidth: "600px", margin: "20px auto" }}
        >
          <h3>Testing the useHeaderBehaviors Hook</h3>
          <p>This story demonstrates the configurable behavior system:</p>
          <ul>
            <li>
              <strong>All interactions are tracked</strong> - Check the Actions
              panel
            </li>
            <li>
              <strong>Routing is disabled</strong> - Safe for Storybook
              environment
            </li>
            <li>
              <strong>Search has loading states</strong> - Try searching to see
              loading indicator
            </li>
            <li>
              <strong>Mobile menu state management</strong> - Try the hamburger
              menu
            </li>
            <li>
              <strong>Analytics integration</strong> - All events are logged
            </li>
          </ul>

          <h3>Configurable Behaviors</h3>
          <ul>
            <li>Search submission with async support</li>
            <li>Navigation with custom handlers</li>
            <li>Mobile menu state management</li>
            <li>User action tracking</li>
            <li>Error handling</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the behavior hook system with visible event tracking and configuration options.",
      },
    },
  },
};

// Search behavior showcase
export const SearchBehavior: Story = {
  args: {
    favoritesCount: 0,
    cartItemsCount: 0,
    userLocation: "Laurent, Jakarta",
    isLoggedIn: false,
    behaviorConfig: {
      enableRouting: false,
      onSearchSubmit: async (query: string) => {
        action("search-submit")(query);
        // Simulate API call with loading
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const results = query.length * 3; // Mock results based on query length
        action("search-completed")({ query, results });
        return results;
      },
      onSearchQueryChange: (query: string) => {
        action("search-query-change")(query);
      },
      onUserAction: action("user-action"),
    },
  },
  render: (args) => (
    <div>
      <HeaderWithAnalytics {...args} />
      <div
        style={{
          padding: "40px 20px",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <h2>Search Behavior Demo</h2>
        <p>This story focuses on search functionality:</p>
        <ul
          style={{ textAlign: "left", maxWidth: "500px", margin: "20px auto" }}
        >
          <li>Type in the search box to see query change events</li>
          <li>Submit a search to see loading state and async behavior</li>
          <li>Search results are simulated and tracked</li>
          <li>All search events appear in the Actions panel</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Focuses on search behavior including async search submission, loading states, and event tracking.",
      },
    },
  },
};

// Accessibility showcase
export const AccessibilityFeatures: Story = {
  args: {
    favoritesCount: 3,
    cartItemsCount: 2,
    userLocation: "Laurent, Jakarta",
    isLoggedIn: true,
  },
  render: (args) => (
    <div style={{ minHeight: "200px" }}>
      <HeaderWithAnalytics {...args} />
      <div
        style={{
          padding: "40px 20px",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <h2>Accessibility Features</h2>
        <div
          style={{ textAlign: "left", maxWidth: "600px", margin: "20px auto" }}
        >
          <h3>Keyboard Navigation</h3>
          <p>
            All interactive elements are keyboard accessible using Tab, Enter,
            and Arrow keys.
          </p>

          <h3>Screen Reader Support</h3>
          <ul>
            <li>Proper semantic HTML structure (header, nav, search)</li>
            <li>ARIA labels for complex interactions</li>
            <li>Live regions for dynamic content updates</li>
            <li>Descriptive button labels</li>
          </ul>

          <h3>Visual Accessibility</h3>
          <ul>
            <li>High contrast focus indicators</li>
            <li>Sufficient color contrast ratios</li>
            <li>Scalable text and icons</li>
            <li>Respects user motion preferences</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the accessibility features built into the Header component.",
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "keyboard-navigation",
            enabled: true,
          },
        ],
      },
    },
  },
};

// Theme demonstration
export const ThemeSupport: Story = {
  args: {
    favoritesCount: 3,
    cartItemsCount: 2,
    userLocation: "Laurent, Jakarta",
    isLoggedIn: true,
  },
  render: (args) => (
    <div>
      <HeaderWithAnalytics {...args} />
      <div
        style={{
          padding: "40px 20px",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <h2>Theme Support</h2>
        <p>
          The Header component automatically adapts to light and dark themes:
        </p>
        <ul
          style={{ textAlign: "left", maxWidth: "500px", margin: "20px auto" }}
        >
          <li>Uses CSS custom properties for consistent theming</li>
          <li>
            Supports both automatic (system preference) and manual theme
            switching
          </li>
          <li>All colors and hover states adapt to the current theme</li>
          <li>Search bar and navigation maintain proper contrast</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shows how the Header component integrates with the application theming system.",
      },
    },
  },
};

// Responsive showcase
export const ResponsiveShowcase: Story = {
  args: {
    favoritesCount: 5,
    cartItemsCount: 3,
    userLocation: "Laurent, Jakarta",
    isLoggedIn: true,
  },
  render: (args) => (
    <div>
      <HeaderWithAnalytics {...args} />
      <div
        style={{
          padding: "40px 20px",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <h2>Responsive Design</h2>
        <div
          style={{ textAlign: "left", maxWidth: "600px", margin: "20px auto" }}
        >
          <h3>Desktop (1024px+)</h3>
          <p>
            Full layout with all elements visible, including detailed text and
            spacing.
          </p>

          <h3>Tablet (768px - 1024px)</h3>
          <p>
            Condensed layout with abbreviated text labels and tighter spacing.
          </p>

          <h3>Mobile (Below 768px)</h3>
          <p>Simplified layout with hamburger menu, essential elements only.</p>

          <p>
            <strong>
              Try resizing the browser window to see the responsive behavior!
            </strong>
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates responsive behavior across different screen sizes. Resize the viewport to see changes.",
      },
    },
  },
};

// Empty state
export const EmptyState: Story = {
  args: {
    favoritesCount: 0,
    cartItemsCount: 0,
    userLocation: "Select Location",
    isLoggedIn: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Header in an empty state with no items in cart or favorites.",
      },
    },
  },
};

// Custom styling example
export const CustomStyling: Story = {
  args: {
    favoritesCount: 2,
    cartItemsCount: 1,
    userLocation: "Laurent, Jakarta",
    isLoggedIn: true,
    className: "custom-header-styling",
  },
  render: (args) => (
    <div>
      <style>{`
        .custom-header-styling {
          border-bottom: 3px solid #0066cc;
        }
        .custom-header-styling .header__logo svg {
          filter: hue-rotate(45deg);
        }
        .custom-header-styling .header__search-input {
          border-radius: 20px;
        }
      `}</style>
      <HeaderWithAnalytics {...args} />
      <div
        style={{
          padding: "40px 20px",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <h2>Custom Styling</h2>
        <p>
          The Header component can be customized with additional CSS classes and
          styling overrides while maintaining behavior functionality.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Example of how to apply custom styling to the Header component while preserving behavior.",
      },
    },
  },
};

// Error handling demonstration
export const ErrorHandling: Story = {
  args: {
    favoritesCount: 1,
    cartItemsCount: 1,
    userLocation: "Laurent, Jakarta",
    isLoggedIn: false,
    behaviorConfig: {
      enableRouting: false,
      onSearchSubmit: async (query: string) => {
        action("search-submit")(query);
        if (query.toLowerCase().includes("error")) {
          throw new Error("Simulated search error");
        }
        return 5;
      },
      onUserAction: action("user-action"),
    },
  },
  render: (args) => (
    <div>
      <HeaderWithAnalytics {...args} />
      <div
        style={{
          padding: "40px 20px",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <h2>Error Handling Demo</h2>
        <p>This story demonstrates error handling in behaviors:</p>
        <ul
          style={{ textAlign: "left", maxWidth: "500px", margin: "20px auto" }}
        >
          <li>Try searching for "error" to trigger a simulated error</li>
          <li>Check the Actions panel to see error tracking</li>
          <li>Notice how the component gracefully handles failures</li>
          <li>Search state is properly reset after errors</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates error handling in the behavior system and how the component recovers from failures.",
      },
    },
  },
};
