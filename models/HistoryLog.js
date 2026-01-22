import { Schema, model } from 'mongoose';

const HistoryLogSchema = new Schema({
  company_name: { type: String },
  domain: String,
  agent: String,
  disposition: String,
  remarks: String,
  headquarters: String,
  run_id: String,
  screenshot_url: String,
  google_query: String,
  created_at: { type: Date, default: Date.now }
});

HistoryLogSchema.index({ company_name: 1 });
HistoryLogSchema.index({ disposition: 1 });
HistoryLogSchema.index({ created_at: -1 });

export default model('HistoryLog', HistoryLogSchema);
