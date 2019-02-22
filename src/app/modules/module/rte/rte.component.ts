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
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';

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
                'advlist lists link anchor table paste code help contextmenu textcolor image imagetools'
            ],
            toolbar: ['formatselect | styleselect | bold italic strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | removeformat | table | code | image | contextmenu'],
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
                { title: 'Story table', selector: 'table', classes: 'story-table' },
                { title: 'Image content table', selector: 'table', classes: 'image-content-table' }
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