import React from 'react'
import { EditJournalForm } from './edit-journal-form'
import { ParamsWithId } from '@/types'
import { journalService } from '@/services/journal.service';
import { notFound } from 'next/navigation';
import { bookAccountService } from '@/services/book-account.service';

export default async function Page({ params }: ParamsWithId) {
  const { id } = await params;
  const journalEntry = await journalService.findById(id);

  if (!journalEntry) {
    notFound();
  }

  return (
    <EditJournalForm journalEntry={journalEntry} />
  )
}
