import { Alert, AlertDescription, AlertTitle } from '@repo/ui/alert';
import { Badge } from '@repo/ui/badge';
import { Button } from '@repo/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/card';
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/dialog';
import { FormField } from '@repo/ui/form-field';
import { ArrowRight, Icon } from '@repo/ui/icon';
import { Input } from '@repo/ui/input';
import {
  Navigation,
  NavigationItem,
  NavigationLink,
} from '@repo/ui/navigation';
import styles from './preview.module.css';

export default function DesignSystemPreview() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <header className={styles.header}>
        <Badge variant="primary">Internal preview</Badge>
        <h1>CodeKids UI foundations</h1>
        <p>Token-based, keyboard-accessible primitives for product surfaces.</p>
      </header>

      <Navigation label="Component preview">
        <NavigationItem>
          <NavigationLink current href="#actions">
            Actions
          </NavigationLink>
        </NavigationItem>
        <NavigationItem>
          <NavigationLink href="#forms">Forms</NavigationLink>
        </NavigationItem>
        <NavigationItem>
          <NavigationLink href="#feedback">Feedback</NavigationLink>
        </NavigationItem>
      </Navigation>

      <section className={styles.grid} id="actions">
        <Card>
          <CardHeader>
            <CardTitle>Actions and badges</CardTitle>
            <CardDescription>
              Variants share focus, disabled, and active states.
            </CardDescription>
          </CardHeader>
          <CardContent className={styles.row}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="danger">Danger</Button>
            <Badge variant="success">Complete</Badge>
            <Badge variant="warning">In progress</Badge>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open accessible dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Ready for the next level?</DialogTitle>
                <DialogDescription>
                  Focus stays inside this dialog and returns to its trigger when
                  closed.
                </DialogDescription>
                <DialogActions>
                  <DialogClose asChild>
                    <Button variant="secondary">Not yet</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button>
                      Continue <Icon icon={ArrowRight} size="sm" />
                    </Button>
                  </DialogClose>
                </DialogActions>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card id="forms">
          <CardHeader>
            <CardTitle>Form field</CardTitle>
            <CardDescription>
              Labels, help text, required state, and errors are associated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              description="Use the address connected to the parent account."
              label="Parent email"
              required
            >
              <Input
                autoComplete="email"
                name="email"
                placeholder="parent@example.com"
                type="email"
              />
            </FormField>
          </CardContent>
        </Card>
      </section>

      <section className={styles.stack} id="feedback">
        <Alert variant="info">
          <AlertTitle>New activity unlocked</AlertTitle>
          <AlertDescription>Your next coding puzzle is ready.</AlertDescription>
        </Alert>
        <Alert variant="danger">
          <AlertTitle>Session expired</AlertTitle>
          <AlertDescription>Sign in again to continue safely.</AlertDescription>
        </Alert>
      </section>
    </main>
  );
}
