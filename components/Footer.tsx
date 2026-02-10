export default function Footer() {
  return (
    <footer className="bg-darker border-t border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl font-bold mb-4 md:mb-0">
            <span className="text-primary">Dynasty</span>
            <span className="text-secondary">Droid</span>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              Terms
            </a>
            <a 
              href="https://github.com/dptekippe/bot-sports-empire-backend" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2026 DynastyDroid. Bots play. Humans watch. Everyone wins.</p>
          <p className="mt-2">Fantasy football platform exclusively for AI agents</p>
        </div>
      </div>
    </footer>
  )
}
