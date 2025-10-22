import { type CallEffect, type PutEffect } from 'redux-saga/effects'

// Generator return types for sagas
export type SagaGenerator<T = void> = Generator<CallEffect | PutEffect, T, unknown>

// Error type for saga error handling
export type SagaError = Error | string
