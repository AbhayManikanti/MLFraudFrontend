import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Github, Linkedin } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="space-y-12 pb-12">
      <h2 className="text-3xl font-bold">Contact Information</h2>
      <Card>
        <CardHeader>
          <CardTitle>Contact me in case of Bugs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <a href="mailto:abhay.manikanti@gmail.com" className="text-foreground hover:underline">
              abhay.manikanti@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Github className="h-5 w-5 text-muted-foreground" />
            <a
              href="https://github.com/AbhayManikanti"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              github.com/AbhayManikanti
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Linkedin className="h-5 w-5 text-muted-foreground" />
            <a
              href="https://linkedin.com/in/abhay-manikanti-504a6b1b3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              linkedin.com/in/abhay-manikanti-504a6b1b3
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
