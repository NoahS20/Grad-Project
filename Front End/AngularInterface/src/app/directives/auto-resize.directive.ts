import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoResize]'
})
export class AutoResizeDirective {
  constructor(private elementRef: ElementRef<HTMLTextAreaElement>) {}

  @HostListener('input')
  onInput(): void {
    this.adjustHeight();
  }

  private adjustHeight(): void {
    const textarea = this.elementRef.nativeElement;
    textarea.style.overflow = 'hidden'; // Prevent scrollbar flash
    textarea.style.height = 'auto'; // Reset height to recalculate
    textarea.style.height = textarea.scrollHeight + 'px'; // Set height to fit content
  }

  resetHeight(): void {
    const textarea = this.elementRef.nativeElement;
    textarea.style.height = '38px';  // Reset to initial or default height.
  }
}
