'use client';
import { useRef, useState, useEffect } from 'react';
import WithoutApiResumeForm from '@/app/components/WithoutApiResumeForm';
import type { WithoutApiProfileData } from '@/app/utils/profilePrompt';

type GenerationMode = 'api' | 'without-api';

type ContactInfo = {
  phone: string;
  linkedin: string;
  github: string;
  lastCompany: string;
  university: string;
};

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const [mode, setMode] = useState<GenerationMode>('without-api');
  const [profileName, setProfileName] = useState<string | null>(null);
  const [selectedProfiles, setSelectedProfiles] = useState<string[] | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<string[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState('');
  const [gateLoading, setGateLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [withoutApiProfileData, setWithoutApiProfileData] = useState<WithoutApiProfileData | null>(null);
  const [withoutApiProfileLoading, setWithoutApiProfileLoading] = useState(false);

  useEffect(() => {
    // load available profiles for selection list
    fetch('/api/profiles')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profiles) setAvailableProfiles(data.profiles.map((p: any) => p.name));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedProfiles || selectedProfiles.length === 0) return;

    if (!activeProfile) {
      setActiveProfile(selectedProfiles[0]);
      return;
    }

    if (mode === 'api') {
      const params = new URLSearchParams({ profile: activeProfile });
      fetch(`/api/contact-info?${params}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => data && setContactInfo(data))
        .catch(() => {});
      return;
    }

    // without-api: fetch profile data for all selected profiles
    setContactInfo(null);
    setWithoutApiProfileLoading(true);
    const fetches = selectedProfiles.map((p) => {
      const params = new URLSearchParams({ profile: p });
      return fetch(`/api/without-api/profile-data?${params}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => ({ profile: p, data }))
        .catch(() => ({ profile: p, data: null }));
    });

    Promise.all(fetches)
      .then((results) => {
        const map: Record<string, any> = {};
        results.forEach((r) => {
          map[r.profile] = r.data;
        });
        setWithoutApiProfileData(map as any);
      })
      .finally(() => setWithoutApiProfileLoading(false));
  }, [selectedProfiles, mode, activeProfile]);

  const copyToClipboard = async (label: string, value: string) => {
    if (!value.trim()) return;
    try {
      await navigator.clipboard.writeText(value.trim());
      setCopyFeedback(label);
      setTimeout(() => setCopyFeedback(null), 1500);
    } catch {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(null), 1500);
    }
  };

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = gateInput.trim();
    if (!value) {
      setGateError('Please enter a profile.');
      return;
    }
    setGateError('');
    setGateLoading(true);
    try {
      const res = await fetch('/api/validate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGateError(data.error || 'Profile not found');
        return;
      }
      // if user has selected candidates from list, prefer those
      if (selectedCandidates.length > 0) {
        setSelectedProfiles(selectedCandidates);
      } else {
        setSelectedProfiles([data.name]);
      }
    } catch {
      setGateError('Something went wrong. Please try again.');
    } finally {
      setGateLoading(false);
    }
  };

  const handleBack = () => {
    setProfileName(null);
    setSelectedProfiles(null);
    setSelectedCandidates([]);
    setActiveProfile(null);
    setContactInfo(null);
    setWithoutApiProfileData(null);
    setCopyFeedback(null);
  };

  if (!selectedProfiles) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Resume Generator</h1>
          <form onSubmit={handleGateSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as GenerationMode)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
              >
                <option value="without-api">Without API</option>
                <option value="api">Using API</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {mode === 'api'
                  ? 'OpenAI generates and tailors the resume automatically.'
                  : 'Copy a prompt to ChatGPT, paste the JSON response, then generate PDF.'}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Profile</label>
              <input
                type="text"
                value={gateInput}
                onChange={(e) => setGateInput(e.target.value)}
                placeholder="e.g. Adam-smith"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                autoFocus
                autoComplete="off"
              />
              {availableProfiles.length > 0 && (
                <div className="mt-3 border rounded-md p-2 bg-gray-50">
                  <p className="text-xs text-gray-600 mb-2">Or pick one or more profiles:</p>
                  <div className="max-h-40 overflow-auto grid grid-cols-2 gap-2">
                    {availableProfiles.map((p) => (
                      <label key={p} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(p)}
                          onChange={() => {
                            setSelectedCandidates((prev) =>
                              prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
                            );
                          }}
                        />
                        <span className="truncate">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {gateError && <p className="text-sm text-red-600">{gateError}</p>}
            <button
              type="submit"
              disabled={gateLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200"
            >
              {gateLoading ? 'Checking...' : selectedCandidates.length > 0 ? 'Continue with selected profiles' : 'Continue'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const contactFields: { key: keyof ContactInfo; label: string }[] = [
    { key: 'phone', label: 'Phone' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'github', label: 'GitHub' },
    { key: 'lastCompany', label: 'Last Company' },
    { key: 'university', label: 'University' },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">
            {mode === 'api' ? 'Dynamic Resume PDF Generator' : 'Manual Resume Generator'}
          </h1>
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Change profile
          </button>
        </div>
        <div className="text-center mb-1">
          <p className="text-sm text-gray-500">
            Profiles: {selectedProfiles?.length ? selectedProfiles.join(', ') : ''}
          </p>
          {selectedProfiles && selectedProfiles.length > 1 && (
            <div className="mt-2">
              <label className="text-xs text-gray-500 mr-2">Active:</label>
              <select
                value={activeProfile ?? ''}
                onChange={(e) => setActiveProfile(e.target.value)}
                className="text-sm border border-gray-300 rounded-md p-1"
              >
                {selectedProfiles.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-4 text-center">
          Mode: {mode === 'api' ? 'Using API' : 'Without API'}
        </p>

        {mode === 'without-api' ? (
          <WithoutApiResumeForm
            profileName={activeProfile ?? selectedProfiles?.[0] ?? ''}
            profileData={
              // when multiple profiles selected the data is a map
              (withoutApiProfileData && (withoutApiProfileData as any)[(activeProfile ?? selectedProfiles?.[0])]) ||
              (withoutApiProfileData as any)
            }
            profileDataLoading={withoutApiProfileLoading}
            multipleProfiles={selectedProfiles}
          />
        ) : (
          <>
            {contactInfo && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Copy to clipboard:</p>
                <div className="flex flex-wrap gap-2">
                  {contactFields.map(({ key, label }) => {
                    const value = contactInfo[key]?.trim() ?? '';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => copyToClipboard(label, value)}
                        disabled={!value}
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md border border-gray-300 text-gray-800 transition-colors"
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {copyFeedback && (
                  <p className="text-xs text-green-600 mt-2">Copied: {copyFeedback}</p>
                )}
              </div>
            )}

            <form
              ref={formRef}
              action="/api/generate-dynamic-resume-pdf"
              method="POST"
              encType="multipart/form-data"
              target="_blank"
              className="space-y-6"
            >
              <input type="hidden" name="base_resume_profile" value={activeProfile ?? selectedProfiles?.[0]} />
              <div>
                <label className="block text-gray-700 font-medium mb-2">Job Description:</label>
                <textarea
                  name="job_description"
                  required
                  rows={6}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Company:</label>
                <input
                  name="company"
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Role:</label>
                <input
                  name="role"
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200"
              >
                Generate PDF
              </button>
              {selectedProfiles && selectedProfiles.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    // gather form values
                    const form = formRef.current;
                    if (!form) return;
                    const jd = (form.querySelector('[name="job_description"]') as HTMLTextAreaElement).value;
                    const company = (form.querySelector('[name="company"]') as HTMLInputElement).value;
                    const role = (form.querySelector('[name="role"]') as HTMLInputElement).value;
                    selectedProfiles.forEach((profile) => {
                      const f = document.createElement('form');
                      f.method = 'POST';
                      f.action = '/api/generate-dynamic-resume-pdf';
                      f.target = '_blank';
                      const add = (name: string, value: string) => {
                        const i = document.createElement('input');
                        i.type = 'hidden';
                        i.name = name;
                        i.value = value;
                        f.appendChild(i);
                      };
                      add('base_resume_profile', profile);
                      add('job_description', jd);
                      add('company', company);
                      add('role', role);
                      document.body.appendChild(f);
                      f.submit();
                      document.body.removeChild(f);
                    });
                  }}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200"
                >
                  Generate for all selected profiles
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </main>
  );
}
