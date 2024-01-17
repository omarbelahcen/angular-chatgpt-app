import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-gpt',
  templateUrl: './gpt.component.html',
  styleUrl: './gpt.component.css'
})
export class GptComponent implements OnInit {

  private readonly apiUrl = "https://api.openai.com/v1/chat/completions";

  queryFormGroup!: FormGroup;
  result: any;

  messages = [
    {role: "system", content: "You are a helpful assistant."}
  ];
  
  ngOnInit(): void {
    this.queryFormGroup = this.fb.group({
      query: this.fb.control('')
    });
  }

  constructor(private fb: FormBuilder, private httpClient: HttpClient) {}

  handleAskGPT() {
    // TODO add and externalise apikey property
    let apikey;
    const httpHeaders = new HttpHeaders().set("Authorization", "Bearer "+ apikey);
    console.log("Headers: ", httpHeaders);
    this.messages.push(
      {role: "user", content: this.queryFormGroup.value.query} 
    );
    const payload = {
      model: "gpt-3.5-turbo",
      messages: this.messages
    };
    this.httpClient.post(this.apiUrl, payload, { headers: httpHeaders }).subscribe({
      next: resp => {
        this.result = resp;
        this.result.choices.forEach((choice: any) => {
          this.messages.push(
            {role: "assistant", content: choice.message.content}
            
          );
          this.messages.forEach(message => {
            console.log("Role: ", message.role, "Content: ", message.content)
          });
        });
      },
      error: err => {
        console.log("Error request API: " + err);
      }
    });
  }

}
