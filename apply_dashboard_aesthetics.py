#!/usr/bin/env python3
"""
Apply same aesthetic improvements to dashboard.
"""
import os

# Update globals.css with cyber hover effects
globals_css_path = 'app/globals.css'
with open(globals_css_path, 'a') as f:
    f.write('''

/* Cyber hover effects */
.hover-glow {
  transition: all 0.3s ease;
}

.hover-glow:hover {
  transform: translateY(-5px);
  border-color: #00ff88;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
}

/* Glass button effects */
.glass-btn {
  background: rgba(0, 255, 136, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid #00ff88;
  color: #00ff88;
  transition: all 0.3s ease;
}

.glass-btn:hover {
  background: #00ff88;
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 255, 136, 0.3);
}

/* Secondary glass button */
.glass-btn-secondary {
  background: rgba(0, 136, 255, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid #0088ff;
  color: #0088ff;
  transition: all 0.3s ease;
}

.glass-btn-secondary:hover {
  background: #0088ff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 136, 255, 0.3);
}

/* Accent glass button */
.glass-btn-accent {
  background: rgba(255, 0, 136, 0.2);
  backdrop-filter: blur(4px);
  border: 1px solid #ff0088;
  color: #ff0088;
  transition: all 0.3s ease;
}

.glass-btn-accent:hover {
  background: #ff0088;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 0, 136, 0.3);
}

/* Code syntax highlighting */
.code-curl {
  color: #ff79c6;
}

.code-url {
  color: #f1fa8c;
}

.code-json {
  color: #8be9fd;
}

.code-comment {
  color: #6272a4;
}
''')

print("✅ Dashboard aesthetics updated!")
print("Added to globals.css:")
print("1. Cyber hover effects (.hover-glow)")
print("2. Glass buttons (primary, secondary, accent)")
print("3. Code syntax highlighting classes")
print("")
print("Now update components to use these classes...")

# Update Header component to use glass button
header_path = 'components/Header.tsx'
if os.path.exists(header_path):
    with open(header_path, 'r') as f:
        header_content = f.read()
    
    # Update the Register Bot link to use glass button
    header_content = header_content.replace(
        'className="hover:text-primary transition-colors font-bold"',
        'className="glass-btn px-4 py-2 rounded-lg font-bold"'
    )
    
    with open(header_path, 'w') as f:
        f.write(header_content)
    print("✅ Header updated with glass button")

# Update home page to use hover-glow on feature cards
home_page_path = 'app/page.tsx'
if os.path.exists(home_page_path):
    with open(home_page_path, 'r') as f:
        home_content = f.read()
    
    # Add hover-glow class to active bot cards
    home_content = home_content.replace(
        'className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-primary transition-colors"',
        'className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover-glow"'
    )
    
    # Add glass buttons to CTAs
    home_content = home_content.replace(
        'className="inline-block bg-primary text-dark font-bold text-xl px-8 py-4 rounded-lg hover:bg-opacity-90 transition-colors mb-4"',
        'className="inline-block glass-btn font-bold text-xl px-8 py-4 rounded-lg mb-4"'
    )
    
    with open(home_page_path, 'w') as f:
        f.write(home_content)
    print("✅ Home page updated with cyber effects")

print("\n🎨 Dashboard now matches landing page aesthetic!")
print("Consistent design language across all pages.")
