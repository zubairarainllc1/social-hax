import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 bg-background">
      <div className="container max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-muted-foreground">
        <div>
          <h3 className="font-headline text-lg font-bold text-primary mb-2">SocialHAx</h3>
          <p>The leading provider of social reconnaissance solutions. Anonymity and discretion are our top priorities.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/orders" className="hover:text-primary transition-colors">Order Status</Link></li>
            <li><a href="#" className="hover:text-primary transition-colors">Services</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Acceptable Use Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="container max-w-5xl mt-8 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground">
        <p>© 2024 SocialHAx. All operations are conducted in accordance with international digital access treaties.</p>
        <p className="mt-1">For authorized use only. Unauthorized access is strictly monitored and prosecuted.</p>
      </div>
    </footer>
  );
}
