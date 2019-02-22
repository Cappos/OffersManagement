import {
    AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChange,
    SimpleChanges
} from "@angular/core";
import 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/code';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/help';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/table';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/textcolor';

declare const tinymce: any;

@Component({
    selector: 'app-tiny-editor',
    template: `<textarea id="{{elementId}}"></textarea>`
})
export class RteComponent implements OnDestroy, AfterViewInit, OnChanges {
    @Input() elementId: String;
    @Output() onEditorContentChange = new EventEmitter();
    @Input() editMode: boolean;
    editor;
    @Input() rteData: EventEmitter<string>;
    editorInit = 0;


    ngAfterViewInit() {
        console.log(this.editMode);
        tinymce.init({
            selector: '#' + this.elementId,
            theme: 'modern',
            plugins: [
                'advlist lists link anchor table paste code help contextmenu textcolor'
            ],
            toolbar: ['formatselect | bold italic strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | removeformat | table | code | contextmenu'],
            textcolor_map: [
                "000000", "Black",
                "993300", "Burnt orange",
                "333333", "Very dark gray",
                "FF6600", "Orange",
                "008000", "Green",
                "1e69b3", "Blue",
                "5B5A5A", "Gray",
                "FF0000", "Red",
                "FF9900", "Amber",
                "800080", "Purple",
                "FFFF00", "Yellow",
                "FFFFFF", "White"
            ],
            style_formats: [
                { title: 'Headers', items: [
                        { title: 'h1', block: 'h1' },
                        { title: 'h2', block: 'h2' },
                        { title: 'h3', block: 'h3' },
                        { title: 'h4', block: 'h4' },
                        { title: 'h5', block: 'h5' },
                        { title: 'h6', block: 'h6' }
                    ] },

                { title: 'Blocks', items: [
                        { title: 'p', block: 'p' },
                        { title: 'div', block: 'div' },
                        { title: 'pre', block: 'pre' }
                    ] },

                { title: 'Containers', items: [
                        { title: 'section', block: 'section', wrapper: true, merge_siblings: false },
                        { title: 'article', block: 'article', wrapper: true, merge_siblings: false },
                        { title: 'blockquote', block: 'blockquote', wrapper: true },
                        { title: 'hgroup', block: 'hgroup', wrapper: true },
                        { title: 'aside', block: 'aside', wrapper: true },
                        { title: 'figure', block: 'figure', wrapper: true }
                    ] },
                { title: 'Table', items: [
                        { title: 'Table row 1', selector: 'tr', classes: 'tablerow1' }
                    ] }
            ],
            skin_url: '/assets/skins/lightgray',
            height: 300,
            branding: false,
            menubar: false,
            setup: editor => {
                console.log(' setup');
                this.editor = editor;
                let edit = this.editMode ? 'design' : 'readonly';
                editor.setMode(edit);
                editor.on('init', () => {
                    this.editor.setContent(this.rteData);
                    this.editorInit++;
                });
                editor.on('keyup change', () => {
                    const content = editor.getContent();
                    this.onEditorContentChange.emit(content);
                });
            },
        });
    }

    ngOnChanges() {
        if (this.editMode && this.editorInit == 1) {
            tinymce.activeEditor.setMode('design');
            this.editorInit++;
        }
        else if (!this.editMode && this.editorInit >= 2) {
            tinymce.activeEditor.setMode('readonly');
            this.editorInit--;
        }
    }

    ngOnDestroy() {
        console.log('destroy rte');
        tinymce.remove(this.editor);
    }
}