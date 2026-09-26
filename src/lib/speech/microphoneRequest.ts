// getUserMedia cannot be aborted. Invalidate abandoned requests so a late
// permission response cannot start recording or change a newer practice.
export class MicrophoneRequest {
  private revision = 0;
  private current: number | null = null;

  begin() {
    const ticket = ++this.revision;
    this.current = ticket;
    return ticket;
  }

  owns(ticket: number) { return this.current === ticket; }

  finish(ticket: number) {
    if (this.owns(ticket)) this.current = null;
  }

  cancel() {
    if (this.current === null) return false;
    this.current = null;
    return true;
  }
}
